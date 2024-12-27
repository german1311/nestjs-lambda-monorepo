import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ObjectId } from "mongoose";

export abstract class BaseEntity {
    /**
     *
     */
    constructor() {
        this.isDeleted = false;
    }

    @ApiProperty()
    @Expose()
    public _id: ObjectId;

    @Prop()
    @Expose()
    public isDeleted: boolean;

    @Prop()
    @Expose()
    protected createdAt: Date;

    @Prop()
    @Expose()
    protected updatedAt: Date;
}
