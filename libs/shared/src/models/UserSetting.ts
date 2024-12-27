import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { BaseEntity } from "./BaseEntity";

export class UserSetting extends BaseEntity {
    @Prop({ required: true })
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true, ref: "Setting" })
    settingId: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

export const UserSettingSchema = SchemaFactory.createForClass(UserSetting);
