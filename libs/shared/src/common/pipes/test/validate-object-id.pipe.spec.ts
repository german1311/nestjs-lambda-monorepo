import { ValidateObjectIdPipe } from "../validate-object-id.pipe";
import { Types } from "mongoose";

jest.mock("../../utils/throw-error.utils", () => ({
    throwError: jest.fn(),
}));

describe("ValidateObjectIdPipe", () => {
    let pipe: ValidateObjectIdPipe;
    const entity = "TestEntity";

    beforeEach(() => {
        pipe = new ValidateObjectIdPipe(entity);
    });

    it("should throw error if no id is provided", async () => {
        const params = {};
        const throwErrorSpy = jest.spyOn(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require("../../utils/throw-error.utils"),
            "throwError",
        );

        try {
            await pipe.transform(params);
        } catch (e) {
            expect(throwErrorSpy).toHaveBeenCalledWith(
                { [entity]: "Not found" },
                "No ID provided",
            );
        }
    });

    it("should throw error if id is not valid", async () => {
        const params = { id: "invalidId" };
        const throwErrorSpy = jest.spyOn(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require("../../utils/throw-error.utils"),
            "throwError",
        );

        try {
            await pipe.transform(params);
        } catch (e) {
            expect(throwErrorSpy).toHaveBeenCalledWith(
                { [entity]: "Not found" },
                "Check passed ID",
            );
        }
    });

    it("should return params if id is valid", async () => {
        const params = { id: new Types.ObjectId().toHexString() };
        const result = await pipe.transform(params);

        expect(result).toEqual(params);
    });
});
