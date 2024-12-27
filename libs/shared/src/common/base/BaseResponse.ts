import { IsBoolean, IsObject, IsOptional, IsString } from "class-validator";
import { validateClass } from "../utils";
import { ApiProperty } from "@nestjs/swagger";

export class ErrorType {
    errorMessage?: string;
    errorMessageKey?: string;
    errorCode?: string;
    cause?: unknown;
}

export class BaseResponse<T> {
    @ApiProperty()
    @IsString()
    statusCode: string = "OK";

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    hasError?: boolean;

    @ApiProperty()
    @IsOptional()
    error?: ErrorType;

    @ApiProperty()
    @IsObject()
    @IsOptional()
    body?: T;

    constructor(init?: Partial<BaseResponse<T>>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    /**
     * Builds a new response object
     * @param statusCode the status code of the response
     * @param hasError whether the response has an error
     * @param error the error object
     * @param body the body of the response
     * @returns {BaseResponse<T>} the built response object
     * */
    static build<T>(
        statusCode: string,
        hasError: boolean,
        error?: ErrorType,
        body?: T,
    ): BaseResponse<T> {
        const response = new BaseResponse<T>({
            statusCode,
            hasError,
            error,
            body,
        });

        if (body) {
            response.validate(body.constructor as new () => T);
        }

        return response;
    }

    /**
     * Builds a success response object
     * @param body The Body of the response
     * @param statusCode The status code of the response
     * @returns
     */
    static buildSuccess<T>(
        body: T,
        statusCode: string | undefined = "OK",
    ): BaseResponse<T> {
        return this.build(statusCode, false, undefined, body);
    }

    /**
     * Builds an error response object
     * @param error The error object
     * @param statusCode The status code of the response
     * @returns
     */
    static buildError<T>(
        error: ErrorType,
        statusCode: string | undefined = "ERROR",
    ): BaseResponse<T> {
        return this.build(statusCode, true, error);
    }

    /**
     * Validates and parses the response object against the given body schema
     * @param bodySchema the class schema to validate the body
     * @returns {BaseResponse<T>} the validated and parsed object
     */
    validate(bodySchema: new () => T): BaseResponse<T> {
        const selfValidated = validateClass<BaseResponse<T>>(
            BaseResponse<T>,
            this,
        );

        if (this.body) {
            const bodyValidated = validateClass<T>(bodySchema, this.body);
            selfValidated.body = bodyValidated;
        }

        return selfValidated;
    }
}
