import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { BaseEntity } from "./BaseEntity";

@Schema({ timestamps: true })
export class AccountSetting extends BaseEntity {
    @Prop({ required: true })
    accountId: mongoose.Types.ObjectId;

    @Prop({ required: true, ref: "Setting" })
    settingId: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;

    @Prop({ required: true })
    active: boolean;
}

export const AccountSettingSchema =
    SchemaFactory.createForClass(AccountSetting);
