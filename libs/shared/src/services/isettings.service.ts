import { AccountSetting, Setting, UserSetting } from "@shared/models";
import mongoose from "mongoose";

export type SettingValue =
    | { name: "beneficiaryCINFormat"; value: string }
    | { name: "displayBeneficiaryCMEligible"; value: boolean }
    | { name: "displayBeneficiaryAddress"; value: boolean }
    | { name: "displayBeneficiaryName"; value: boolean }
    | { name: "missedEntryDefaultProvider"; value: string }
    | { name: "emailAddressIntegration"; value: string }
    | { name: "cashOutPrintIframe"; value: boolean }
    | { name: "IANATimeZone"; value: string }
    | {
          name: "helpSchedule";
          value: { from: string; to: string };
      }
    | { name: "daysAuditlog"; value: number }
    | {
          name: "helpUrls";
          value: { faq: string; training: string; zendesk: string };
      }
    | { name: "todayDateAndTime"; value: string }
    | { name: "currency"; value: string }
    | { name: "helpPhone"; value: string }
    | { name: "showSetDateButton"; value: boolean };

export type SettingNames = SettingValue["name"];
export type DynamicValueType = SettingValue["value"];

export type SettingValueMap = {
    [K in SettingNames]: Extract<SettingValue, { name: K }>["value"];
};

export type FilteredSettings<Key extends SettingNames> = Record<
    Key,
    SettingValueMap[Key]
>;

export interface SettingsRequest {
    application: "mobile" | "backoffice";
    settingsName?: SettingNames[];
    userId?: string;
    accountId?: mongoose.Types.ObjectId;
}

export interface ISettingsService {
    getSettings<Key extends SettingNames>(
        request: SettingsRequest & { settingsName?: Key[] },
    ): Promise<FilteredSettings<Key>>;

    getDefaultSettings(
        application: "mobile" | "backoffice",
        names?: SettingNames[],
    ): Promise<Setting[]>;

    getUserSettings(
        settingIds: mongoose.Types.ObjectId[],
        userId: string,
    ): Promise<UserSetting[]>;

    getAccountSettings(
        settingIds: mongoose.Types.ObjectId[],
        accountId?: mongoose.Types.ObjectId,
    ): Promise<AccountSetting[]>;
}
