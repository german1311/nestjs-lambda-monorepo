import * as dotenv from "dotenv";

dotenv.config();

export class ConfigUtil {
    static get(key: string, throwIfNotFound = true): string {
        const value = process.env[key];
        if (throwIfNotFound && !value) {
            throw new Error(`Missing environment variable: ${key}`);
        }

        return value;
    }

    static isLambdaEnvironment(): boolean {
        return this.get("AWS_LAMBDA_FUNCTION_NAME", false) !== undefined;
    }
}
