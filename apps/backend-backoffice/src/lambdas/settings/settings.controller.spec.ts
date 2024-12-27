import { Test, TestingModule } from "@nestjs/testing";
import { SettingsController } from "./settings.controller";
import { getModelToken } from "@nestjs/mongoose";
import { SettingsService } from "@shared/services/settings.service";
import { Account } from "@shared/models/Account";
import { Setting } from "@shared/models/Setting";
import { AccountSetting } from "@shared/models/AccountSetting";
import { UserSetting } from "@shared/models/UserSetting";

describe("SettingsController", () => {
    let appController: SettingsController;

    beforeEach(async () => {
        const settingMock = {
            find: jest.fn(() => ({
                exec: jest.fn(async () => [
                    {
                        _id: "settingId",
                        id: "settingId",
                        name: "myGeneralSettingNotOverridden",
                        default: "myGeneralSettingNotOverridden",
                    },
                    {
                        _id: "settingId",
                        id: "settingId",
                        name: "myGeneralSetting",
                        default: "generalDefaultValue",
                    },
                ]),
            })),
        };

        const userSettingMock = {
            find: jest.fn(() => ({
                exec: jest.fn(async () => [
                    {
                        toObject: jest.fn(() => ({
                            _id: "userSettingId",
                            id: "userSettingId",
                            settingId: "settingId",
                            userId: "66998841f9e67dcffa379112",
                            value: "userSettingValue",
                            active: true,
                        })),
                    },
                ]),
            })),
        };
        const accountMock = {
            findOne: jest.fn(async () => ({})),
        };

        const accountSettingMock = {
            find: jest.fn(() => ({
                exec: jest.fn(async () => [
                    {
                        toObject: jest.fn(() => ({
                            settingId: "settingId",
                            value: "accountSettingValue",
                            active: true,
                        })),
                    },
                ]),
            })),
        };

        const app: TestingModule = await Test.createTestingModule({
            controllers: [SettingsController],
            providers: [
                SettingsService,
                {
                    provide: getModelToken(Account.name),
                    useValue: accountMock,
                },
                {
                    provide: getModelToken(Setting.name),
                    useValue: settingMock,
                },
                {
                    provide: getModelToken(AccountSetting.name),
                    useValue: accountSettingMock,
                },
                {
                    provide: getModelToken(UserSetting.name),
                    useValue: userSettingMock,
                },
            ],
        }).compile();

        appController = app.get<SettingsController>(SettingsController);
    });

    describe("root", () => {
        it("should return 'defaultSetting'", async () => {
            const response = await appController.get(
                "66998841f9e67dcffa379111",
                {},
            );
            expect(response.body).toStrictEqual({
                myGeneralSetting: "generalDefaultValue",
                myGeneralSettingNotOverridden: "accountSettingValue",
            });
        });

        it("should return 'accountSetting'", async () => {
            const response = await appController.get(
                "66998841f9e67dcffa379111",
                {},
            );
            expect(response.body).toStrictEqual({
                myGeneralSetting: "generalDefaultValue",
                myGeneralSettingNotOverridden: "accountSettingValue",
            });
        });

        it("should return 'userSetting'", async () => {
            const response = await appController.get(
                "66998841f9e67dcffa379111",
                {
                    userId: "66998841f9e67dcffa379112",
                },
            );
            expect(response.body).toStrictEqual({
                myGeneralSetting: "generalDefaultValue",
                myGeneralSettingNotOverridden: "userSettingValue",
            });
        });
    });
});
