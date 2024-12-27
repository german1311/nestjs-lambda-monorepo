import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { throwError } from "../throw-error.utils";

describe("throwError", () => {
    it("should throw an HttpException with the correct properties when code is provided", () => {
        const errors = ["error1", "error2"];
        const message = "Test message";
        const code = 500;

        try {
            throwError(errors, message, code);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.getResponse()).toEqual({ message, errors });
            expect(error.getStatus()).toEqual(code);
        }
    });

    it("should throw an HttpException with the correct properties when code is not provided", () => {
        const errors = ["error1", "error2"];
        const message = "Test message";
        const defaultCode = 400;

        try {
            throwError(errors, message);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.getResponse()).toEqual({ message, errors });
            expect(error.getStatus()).toEqual(defaultCode);
        }
    });
});
