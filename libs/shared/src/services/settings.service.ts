import mongoose, { Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";
import {
    DynamicValueType,
    FilteredSettings,
    ISettingsService,
    SettingNames,
    SettingsRequest,
    SettingValue,
} from "./isettings.service";
import { InjectModel } from "@nestjs/mongoose";
import * as sanitize from "mongo-sanitize";
import { Account, AccountSetting, Setting, UserSetting } from "@shared/models";
import { ConfigUtil } from "@shared/common/utils";

@Injectable()
export class SettingsService implements ISettingsService {
    constructor(
        @InjectModel(Account.name)
        private readonly accountModel: Model<Account>,

        @InjectModel(Setting.name)
        private readonly settingModel: Model<Setting>,

        @InjectModel(AccountSetting.name)
        private readonly accountSettingModel: Model<AccountSetting>,

        @InjectModel(UserSetting.name)
        private readonly userSettingModel: Model<UserSetting>,
    ) {}

    async getSettings<Key extends SettingNames>(
        settingsParams: SettingsRequest & { settingsName?: Key[] },
    ): Promise<FilteredSettings<Key>> {
        Logger.debug("Getting settings", settingsParams);

        const settings = await this.getDefaultSettings(
            settingsParams.application,
            settingsParams.settingsName ?? [],
        );
        const settingsIds = settings.map((setting) => setting._id);

        const accountSettings = await this.getAccountSettings(
            settingsIds,
            settingsParams.accountId,
        );
        this.mergeAccountSettings(settings, accountSettings);

        const userSettings = await this.getUserSettings(
            settingsIds,
            settingsParams.userId,
        );
        this.mergeUserSettings(settings, userSettings);

        const filteredSettings = this.formatSettings(
            settings,
            settingsParams.settingsName,
        );

        return this.convertToKeyValue(
            filteredSettings,
        ) as FilteredSettings<Key>;
    }

    public async getDefaultSettings(
        application: "mobile" | "backoffice",
        settingsName: SettingNames[] = [],
    ): Promise<Setting[]> {
        try {
            const query: {
                application: "mobile" | "backoffice";
                product: string;
                name?: { $in: SettingNames[] };
            } = {
                application: application,
                product: ConfigUtil.get("PRODUCT", false) || "parca",
            };

            if (settingsName.length > 0) {
                query.name = { $in: settingsName };
            }
            const applicationSettings = await this.settingModel
                .find(query)
                .exec();
            return applicationSettings;
        } catch (error) {
            Logger.error("Error getting default settings", { error });
            throw error;
        }
    }

    public async getUserSettings(
        settingIds: mongoose.Types.ObjectId[],
        userId: string = "",
    ): Promise<UserSetting[]> {
        if (!userId) {
            return [];
        }
        try {
            const userSettings = await this.userSettingModel
                .find({
                    settingId: { $in: settingIds },
                    userId: new mongoose.Types.ObjectId(userId),
                    active: true,
                })
                .exec();

            Logger.debug("userSettings", { userSettings, settingIds, userId });
            return userSettings;
        } catch (error) {
            Logger.error("Error getting user settings", { error });
            throw error;
        }
    }

    public async getAccountSettings(
        settingIds: mongoose.Types.ObjectId[],
        accountId?: mongoose.Types.ObjectId,
    ): Promise<AccountSetting[]> {
        if (!accountId) {
            return [];
        }

        const account = await this.accountModel.findOne(
            sanitize({ _id: accountId }),
        );
        if (!account) {
            return [];
        }

        try {
            const accountSettings = await this.accountSettingModel
                .find({
                    settingId: { $in: settingIds },
                    accountId: account.id,
                    active: true,
                })
                .exec();

            Logger.debug("accountSettings", {
                accountSettings,
                settingIds,
                accountName: accountId,
            });

            return accountSettings;
        } catch (error) {
            Logger.error("Error getting account settings", { error });
            throw error;
        }
    }

    private mergeUserSettings(
        settings: Setting[],
        userSettings: UserSetting[],
    ): void {
        for (const userSetting of userSettings) {
            // @ts-expect-error userSetting is an object
            const userSettingObj = userSetting.toObject();
            const settingIndex = settings.findIndex(
                (setting) => setting.id === userSettingObj.settingId.toString(),
            );
            if (settingIndex !== -1) {
                settings[settingIndex].default = userSettingObj.value;
            }
        }
    }

    private mergeAccountSettings(
        settings: Setting[],
        accountSettings: AccountSetting[],
    ): void {
        for (const accountSetting of accountSettings) {
            // @ts-expect-error userSetting is an object
            const userSettingObj = accountSetting.toObject();
            const settingIndex = settings.findIndex(
                (setting) =>
                    setting.id.toString() ===
                    userSettingObj.settingId?.toString(),
            );
            if (settingIndex !== -1) {
                settings[settingIndex].default = userSettingObj.value;
            }
        }
    }

    private formatSettings(
        settings: Setting[],
        settingsName: SettingNames[] = [],
    ): SettingValue[] {
        return settings
            .filter(
                (setting) =>
                    settingsName.length === 0 ||
                    // @ts-expect-error evaluates an string within an array
                    settingsName.includes(setting.name),
            )
            .map(
                (setting) =>
                    ({
                        name: setting.name,
                        value: setting.default,
                    }) as SettingValue,
            );
    }

    private convertToKeyValue(settings: SettingValue[]): {
        [key: string]: DynamicValueType;
    } {
        const keyValue: { [key: string]: DynamicValueType } = {};
        settings.forEach((setting) => {
            keyValue[setting.name] = setting.value;
        });
        return keyValue;
    }
}
