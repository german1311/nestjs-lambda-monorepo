import { Module } from "@nestjs/common";
import { SettingsModule } from "./lambdas/settings/settings.module";
import { getMongooseConnectionModule } from "@shared/common/utils";

@Module({
    imports: [getMongooseConnectionModule(), SettingsModule],
    controllers: [],
    providers: [],
})
export class MainModule {}
