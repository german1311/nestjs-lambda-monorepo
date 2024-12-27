import { Handler, Context } from "aws-lambda";
import { Server } from "http";
import { proxy } from "aws-serverless-express";
import { SettingsModule } from "./settings.module";
import { APIGatewayProxyEvent } from "aws-lambda";
import bootstrapServer from "@shared/common/utils/bootstrapServer";

let cachedServer: Server;

export const handler: Handler = async (
    event: APIGatewayProxyEvent,
    context: Context,
) => {
    cachedServer = await bootstrapServer(SettingsModule, cachedServer);
    return proxy(cachedServer, event, context, "PROMISE").promise;
};
