import { AbstractValidationPipe } from "../abstract-validation.pipe";
import {
    ArgumentMetadata,
    ValidationPipe,
    ValidationPipeOptions,
} from "@nestjs/common";

describe("AbstractValidationPipe", () => {
    let pipe: AbstractValidationPipe;
    const options: ValidationPipeOptions = {};
    const targetTypes = { body: String, query: Number, param: Boolean };

    beforeEach(() => {
        pipe = new AbstractValidationPipe(options, targetTypes);
    });

    it("should call super.transform with original metadata when targetType is not defined", async () => {
        const value = "value";
        const metadata: ArgumentMetadata = {
            type: "custom",
            metatype: null,
            data: "",
        };

        const transformSpy = jest.spyOn(ValidationPipe.prototype, "transform");
        await pipe.transform(value, metadata);

        expect(transformSpy).toHaveBeenCalledWith(value, metadata);
    });

    it("should call super.transform with modified metadata when targetType is defined", async () => {
        const value = "value";
        const metadata: ArgumentMetadata = {
            type: "body",
            metatype: null,
            data: "",
        };

        const transformSpy = jest.spyOn(ValidationPipe.prototype, "transform");
        await pipe.transform(value, metadata);

        expect(transformSpy).toHaveBeenCalledWith(value, {
            ...metadata,
            metatype: targetTypes[metadata.type],
        });
    });
});
