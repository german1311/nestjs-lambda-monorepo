import { ApiProperty } from "@nestjs/swagger";
import { IsObjectId } from "@shared/common/utils";

import { IsEnum, IsOptional } from "class-validator";

export enum ApplicationEnum {
    BACKOFFICE = "backoffice",
    MOBILE = "mobile",
}

export class GetSettingsDto {
    @ApiProperty({
        description: "The application name",
    })
    @IsEnum(ApplicationEnum, {
        message: "Application must be either backoffice or mobile",
    })
    application?: "backoffice" | "mobile";

    @ApiProperty({
        required: false,
        default: "",
        description: "Array of setting names comma separated, is optional",
    })
    @IsOptional()
    settingsName?: string | null;

    @ApiProperty({
        required: false,
        description: "User ID, is optional",
    })
    @IsOptional()
    @IsObjectId()
    userId?: string;
}
