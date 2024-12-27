import { ConfigUtil } from "../configUtil";

describe("ConfigUtil", () => {
    beforeEach(() => {
        jest.resetModules(); // Clears any cache between tests.
        // @ts-expect-error process is a global variable.
        process.env = {}; // Reset environment variables.
    });

    describe("get", () => {
        it("should return the value of the environment variable", () => {
            process.env.TEST_KEY = "test_value";
            const result = ConfigUtil.get("TEST_KEY");
            expect(result).toBe("test_value");
        });

        it("should throw an error if the environment variable is not found and throwIfNotFound is true", () => {
            expect(() => ConfigUtil.get("MISSING_KEY")).toThrow(
                "Missing environment variable: MISSING_KEY",
            );
        });

        it("should return undefined if the environment variable is not found and throwIfNotFound is false", () => {
            const result = ConfigUtil.get("MISSING_KEY", false);
            expect(result).toBeUndefined();
        });
    });

    describe("isLambdaEnvironment", () => {
        it("should return true if AWS_LAMBDA_FUNCTION_NAME is defined", () => {
            process.env.AWS_LAMBDA_FUNCTION_NAME = "test_lambda";
            const result = ConfigUtil.isLambdaEnvironment();
            expect(result).toBe(true);
        });

        it("should return false if AWS_LAMBDA_FUNCTION_NAME is not defined", () => {
            const result = ConfigUtil.isLambdaEnvironment();
            expect(result).toBe(false);
        });
    });
});
