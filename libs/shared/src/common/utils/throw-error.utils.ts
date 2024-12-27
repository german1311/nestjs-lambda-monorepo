import { HttpException } from "@nestjs/common/exceptions/http.exception";

export function throwError(errors: string, code?: number): never;
// eslint-disable-next-line no-redeclare
export function throwError(
    errors: unknown,
    message?: unknown,
    code?: number,
): never;

// eslint-disable-next-line no-redeclare
export function throwError(
    errors: unknown,
    message?: unknown,
    code = 400,
): never {
    const bodyResponse = {
        statusCode: "ERROR",
        hasError: true,
        error: {
            errorMessage: message,
            errorCode: code,
            cause: errors,
        },
    };

    // @ts-expect-error - This is a hack to know is an instance of BaseResponse
    if (errors.hasError) {
        throw new HttpException(errors, message as number);
    }

    if (typeof errors === "string") {
        if (typeof message === "number") {
            code = message;
        }
    }

    throw new HttpException(bodyResponse, code);
}
