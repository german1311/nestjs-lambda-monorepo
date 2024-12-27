/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, LoggerService } from "@nestjs/common";
import { Logger } from "@aws-lambda-powertools/logger";

@Injectable()
export class PowerToolsLoggerService implements LoggerService {
    private readonly logger: Logger;

    constructor(serviceName: string) {
        this.logger = new Logger({ serviceName: serviceName });
    }

    log(message: string, ...optionalParams: any[]): void {
        this.logger.info(message, ...optionalParams);
    }

    error(message: string, ...optionalParams: any[]): void {
        this.logger.error(message, ...optionalParams);
    }

    warn(message: string, ...optionalParams: any[]): void {
        this.logger.warn(message, ...optionalParams);
    }

    debug(message: string, ...optionalParams: any[]): void {
        this.logger.debug(message, ...optionalParams);
    }

    verbose(message: string, ...optionalParams: any[]): void {
        this.logger.debug(message, ...optionalParams);
    }
}
