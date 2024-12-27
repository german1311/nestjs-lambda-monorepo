import { Controller, Get, Param, Query } from "@nestjs/common";
import { GetSettingsDto } from "./dtos/GetSettings.dto";
import { SettingsService } from "@shared/services/settings.service";
import {
    FilteredSettings,
    SettingNames,
} from "@shared/services/isettings.service";
import { BaseResponse } from "@shared/common/base/BaseResponse";
import { ApiResponse } from "@nestjs/swagger";
import mongoose from "mongoose";

@Controller("account/:accountId/settings")
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @ApiResponse({
        status: 200,
        description: "Get settings",
        type: BaseResponse<FilteredSettings<SettingNames>>,
    })
    @Get()
    async get(
        @Param("accountId") accountId: string,
        @Query() queryParams: GetSettingsDto,
    ): Promise<BaseResponse<FilteredSettings<SettingNames>>> {
        const settings = await this.settingsService.getSettings({
            application: queryParams.application ?? "backoffice",
            accountId: accountId
                ? new mongoose.Types.ObjectId(accountId)
                : undefined,
            settingsName: queryParams.settingsName
                ?.split(",")
                .map((sn) => sn.trim()) as SettingNames[],
            userId: queryParams.userId,
        });

        return BaseResponse.buildSuccess(settings);
    }
}
