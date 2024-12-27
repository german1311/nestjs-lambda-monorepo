import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { BaseResponse } from "../base/BaseResponse";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : "Internal server error";

        if (typeof message === "string") {
            response.status(status).json(
                BaseResponse.buildError({
                    errorMessage: message,
                    errorMessageKey: request.url,
                }),
            );
            return;
        }

        response.status(status).json(message);
    }
}
