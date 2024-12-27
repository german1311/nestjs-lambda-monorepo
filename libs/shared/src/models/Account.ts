import { BaseEntity } from "./BaseEntity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

enum AccountStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

@Schema({ timestamps: true })
export class Account extends BaseEntity {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    status: AccountStatus;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
