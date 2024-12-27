import { ValidationPipe } from "../validation.pipe";
import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate, ValidationError } from "class-validator";
import { throwError } from "../../utils/throw-error.utils";

jest.mock("class-validator", () => ({
    validate: jest.fn(),
}));

jest.mock("../../utils/throw-error.utils", () => ({
    throwError: jest.fn(),
}));

class CustomType {}

describe("ValidationPipe", () => {
    let pipe: ValidationPipe;

    beforeEach(() => {
        pipe = new ValidationPipe();
    });

    it("should throw BadRequestException if no value is provided", async () => {
        const value = null;
        const metadata: ArgumentMetadata = {
            type: "body",
            metatype: null,
            data: "",
        };

        await expect(pipe.transform(value, metadata)).rejects.toThrow(
            BadRequestException,
        );
    });

    it("should return value if no metatype is provided", async () => {
        const value = "value";
        const metadata: ArgumentMetadata = {
            type: "body",
            metatype: null,
            data: "",
        };

        const result = await pipe.transform(value, metadata);

        expect(result).toEqual(value);
    });

    it("should call throwError if validation errors exist", async () => {
        const value = "value";
        const metadata: ArgumentMetadata = {
            type: "body",
            metatype: CustomType,
            data: "",
        };
        // Mock ValidationError
        const mockValidationError: ValidationError = {
            target: {},
            property: "property",
            value: "value",
            constraints: { type: "error message" },
            children: [],
            contexts: { type: {} },
            toString: () => "error message",
        };

        // Mock validate to return an array of ValidationError
        (validate as jest.Mock).mockResolvedValue([mockValidationError]);

        await pipe.transform(value, metadata);

        expect(validate).toHaveBeenCalled();
        expect(throwError).toHaveBeenCalled();
    });

    it("should return value if no validation errors exist", async () => {
        const value = "value";
        const metadata: ArgumentMetadata = {
            type: "body",
            metatype: String,
            data: "",
        };
        (validate as jest.Mock).mockResolvedValue([]);

        const result = await pipe.transform(value, metadata);

        expect(result).toEqual(value);
    });
});
