import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export abstract class BaseCreateDto {
    @ApiProperty()
    @Optional()
    @IsOptional()
    @IsString()
    @Length(4, 30)
    name: string;

    @ApiProperty()
    @Optional()
    @IsString()
    @IsOptional()
    @Length(3, 3000)
    description: string;
}
