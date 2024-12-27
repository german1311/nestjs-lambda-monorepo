import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongoose";

export abstract class BaseUpdateDto {
    @ApiProperty()
    private _id?: ObjectId;
}
