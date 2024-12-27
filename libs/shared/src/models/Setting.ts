import mongoose from "mongoose";
import { BaseEntity } from "./BaseEntity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Setting extends BaseEntity {
    @Prop({ required: true })
    product: "sims";

    @Prop({ required: true })
    application: "mobile" | "backoffice";

    @Prop({ required: true })
    module: string;

    @Prop({ required: true })
    section: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    type: "string" | "number" | "boolean" | "object" | "array";

    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: any;

    @Prop({ required: true })
    active: boolean;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
