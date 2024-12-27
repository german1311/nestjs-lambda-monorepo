import { validate } from "class-validator";
import { IsObjectId, validateClass } from "../ClassValidatorExtensions";

class TestClass {
    @IsObjectId()
    id: string;
}

describe("ClassValidatorExtensions", () => {
    describe("IsObjectId", () => {
        it("should validate a valid ObjectId", async () => {
            const testInstance = new TestClass();
            testInstance.id = "507f191e810c19729de860ea";

            const errors = await validate(testInstance);
            expect(errors.length).toBe(0);
        });

        it("should invalidate an invalid ObjectId", async () => {
            const testInstance = new TestClass();
            testInstance.id = "invalid-object-id";

            const errors = await validate(testInstance);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty(
                "IsObjectIdConstraint",
            );
        });
    });

    describe("validateClass", () => {
        class TestSchema {
            @IsObjectId()
            id: string;
        }

        it("should validate and transform data correctly", async () => {
            const data = { id: "507f191e810c19729de860ea" };

            const result = await validateClass(TestSchema, data);
            expect(result).toBeInstanceOf(TestSchema);
            expect(result.id).toBe(data.id);
        });

        it("should throw validation errors for invalid data", () => {
            const data = { id: "invalid-object-id" };

            expect(() => validateClass(TestSchema, data)).toThrow();
        });

        it("should allow extraneous properties if excludeExtraneousValues is false", async () => {
            const data = {
                id: "507f191e810c19729de860ea",
                extra: "extra-property",
            };

            const result = await validateClass(TestSchema, data, false);
            expect(result).toBeInstanceOf(TestSchema);
            expect(result.id).toBe(data.id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((result as any).extra).toBe("extra-property");
        });
    });
});
