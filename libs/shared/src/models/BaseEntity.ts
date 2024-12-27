import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import mongoose from "mongoose";

export abstract class BaseEntity {
    /**
     *
     */
    constructor() {
        this.isDeleted = false;
    }

    @ApiProperty()
    @Expose()
    public _id: mongoose.Types.ObjectId;

    public id: string;

    @Prop({ default: false })
    @Expose()
    public isDeleted: boolean;

    @Prop()
    @Expose()
    protected createdAt: Date;

    @Prop()
    @Expose()
    protected updatedAt: Date;

    @Prop({ required: true, ref: "User" })
    createdBy: mongoose.Types.ObjectId;

    @Prop({ required: false, ref: "User" })
    updatedBy: mongoose.Types.ObjectId;
}
