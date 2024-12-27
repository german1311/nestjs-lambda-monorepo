import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SettingsController } from "./settings.controller";
import {
    Account,
    AccountSchema,
    AccountSetting,
    AccountSettingSchema,
    Setting,
    SettingSchema,
    UserSetting,
    UserSettingSchema,
} from "@shared/models";
import { getMongooseConnectionModule } from "@shared/common/utils";
import { SettingsService } from "@shared/services";

@Module({
    imports: [
        getMongooseConnectionModule(),
        MongooseModule.forFeature([
            { name: Setting.name, schema: SettingSchema },
            { name: UserSetting.name, schema: UserSettingSchema },
            { name: Account.name, schema: AccountSchema },
            { name: AccountSetting.name, schema: AccountSettingSchema },
        ]),
    ],
    controllers: [SettingsController],
    providers: [SettingsService],
})
export class SettingsModule {}
