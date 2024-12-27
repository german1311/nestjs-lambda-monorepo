import { HttpException } from "@nestjs/common";
import { Model, Schema } from "mongoose";
import { BaseService } from "../base.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class TestService extends BaseService<any, any, any> {}

class MongoError extends Error {
    code: number;

    constructor(message?: string) {
        super(message);
        this.name = "MongoError";
        this.code = 26;
    }
}

describe("BaseService", () => {
    let service: TestService;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockRepository: Partial<Model<any>>;
    let fakeObjectId: Schema.Types.ObjectId;

    beforeEach(() => {
        mockRepository = {
            find: jest.fn(),
            findById: jest.fn(),
            deleteMany: jest.fn(),
            create: jest.fn(),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        service = new TestService(mockRepository as Model<any>);
        fakeObjectId = new Schema.Types.ObjectId("56cb91bdc3464f14678934ca");
    });

    it("creates a new entity", async () => {
        const data = {
            name: "Test",
            description: "Test",
        };
        const newEntity = {
            ...data,
            isDeleted: false,
        };
        const createdEntity = {
            ...newEntity,
            _id: fakeObjectId,
        };

        jest.spyOn(mockRepository, "create").mockReturnValue(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            createdEntity as any,
        );

        await service.create(data);

        expect(newEntity.isDeleted).toBe(false);
    });

    it("throws an error when clear() fails", async () => {
        jest.spyOn(mockRepository, "deleteMany").mockImplementation(() => {
            throw new Error();
        });

        const logSpy = jest.spyOn(console, "error");

        await expect(service.clear()).rejects.toThrow(Error);
        expect(logSpy).toHaveBeenCalledTimes(1);
    });

    it("throws an MongoError when clear() fails", async () => {
        jest.spyOn(mockRepository, "deleteMany").mockImplementation(() => {
            throw new MongoError();
        });

        const logSpy = jest.spyOn(console, "error");

        await expect(service.clear()).rejects.toThrow(Error);
        expect(logSpy).toHaveBeenCalledWith(
            "Collection does not exist. Unable to clear.",
        );
    });

    it("throws an HttpException when findOne() does not find an entity", async () => {
        jest.spyOn(mockRepository, "findById").mockResolvedValue(null);

        await expect(service.findOne(fakeObjectId)).rejects.toThrow(
            HttpException,
        );
    });
});
