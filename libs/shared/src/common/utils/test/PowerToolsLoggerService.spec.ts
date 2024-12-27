import { PowerToolsLoggerService } from "../PowerToolsLoggerService";
import { Logger } from "@aws-lambda-powertools/logger";

describe("PowerToolsLoggerService", () => {
    let loggerService: PowerToolsLoggerService;

    beforeEach(() => {
        loggerService = new PowerToolsLoggerService("testing-service");
    });

    it("should log a message", () => {
        const loggerSpy = jest.spyOn(Logger.prototype, "info");
        const message = "Test log message";
        loggerService.log(message);
        expect(loggerSpy).toHaveBeenCalledWith(message);
    });

    it("should log an error message", () => {
        const loggerSpy = jest.spyOn(Logger.prototype, "error");

        const errorMessage = "Test error message";
        loggerService.error(errorMessage);
        expect(loggerSpy).toHaveBeenCalledWith(errorMessage);
    });

    it("should log a warning message", () => {
        const loggerSpy = jest.spyOn(Logger.prototype, "warn");

        const warningMessage = "Test warning message";
        loggerService.warn(warningMessage);
        expect(loggerSpy).toHaveBeenCalledWith(warningMessage);
    });

    it("should log an verbose message", () => {
        const loggerSpy = jest.spyOn(Logger.prototype, "debug");

        const infoMessage = "Test info message";
        loggerService.verbose(infoMessage);
        expect(loggerSpy).toHaveBeenCalledWith(infoMessage);
    });

    it("should log a debug message", () => {
        const loggerSpy = jest.spyOn(Logger.prototype, "debug");

        const debugMessage = "Test debug message";
        loggerService.debug(debugMessage);
        expect(loggerSpy).toHaveBeenCalledWith(debugMessage);
    });
});
