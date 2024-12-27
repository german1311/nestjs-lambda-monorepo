import { Test, TestingModule } from "@nestjs/testing";
import { BaseController } from "../base.controller";
import { BaseService } from "../base.service";
import * as mongoose from "mongoose";
import { BaseEntity } from "../base.entity";
import { BaseCreateDto, BaseUpdateDto } from "../dtos";
import { Inject } from "@nestjs/common";

jest.mock("../base.service");

class MockEntity extends BaseEntity {}

class MockUpdateDTO extends BaseUpdateDto {
    public static exec = jest.fn();
}
class MockCreateDTO extends BaseCreateDto {
    public static exec = jest.fn();
}

class MockService extends BaseService<
    MockEntity,
    MockCreateDTO,
    MockUpdateDTO
> {}

class MockController extends BaseController<
    MockEntity,
    MockCreateDTO,
    MockUpdateDTO
>(MockCreateDTO, MockUpdateDTO) {
    constructor(@Inject("MockService") service: MockService) {
        super(service);
    }
}

describe("BaseController", () => {
    let controller: MockController;

    let service: MockService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MockController],
            providers: [
                {
                    provide: "MockService",
                    useClass: MockService,
                },
            ],
        }).compile();

        controller = module.get(MockController);
        service = module.get("MockService");
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should call service.create with correct parameters", async () => {
            const dto: MockCreateDTO = {
                name: "test",
                description: "test",
            };
            const result: MockEntity = {
                // @ts-expect-error is a mock
                _id: "507f1f77bcf86cd799439011",
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(service, "create").mockResolvedValue(result);

            expect(await controller.create(dto)).toBe(result);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe("update", () => {
        it("should call service.update with correct parameters", async () => {
            const params = { id: "507f1f77bcf86cd799439011" };
            const dto: MockUpdateDTO = {
                // @ts-expect-error is a mock
                _id: "507f1f77bcf86cd799439011",
            };
            const result: MockEntity = {
                // @ts-expect-error is a mock
                _id: "507f1f77bcf86cd799439011",
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(service, "update").mockResolvedValue(result);

            // @ts-expect-error testing purposes
            expect(await controller.update(params, dto)).toBe(result);
            expect(service.update).toHaveBeenCalledWith(
                new mongoose.Schema.Types.ObjectId(params.id),
                dto,
            );
        });
    });

    describe("archive", () => {
        it("should call service.updateStatus with correct parameters", async () => {
            const params = { id: "507f1f77bcf86cd799439011" };
            const result: MockEntity = {
                // @ts-expect-error is a mock
                _id: "507f1f77bcf86cd799439011",
                isDeleted: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(service, "updateStatus").mockResolvedValue(result);

            // @ts-expect-error testing purposes
            expect(await controller.archive(params)).toBe(result);
            expect(service.updateStatus).toHaveBeenCalledWith(
                new mongoose.Schema.Types.ObjectId(params.id),
                true,
            );
        });
    });

    describe("unarchive", () => {
        it("should call service.updateStatus with correct parameters", async () => {
            const params = { id: "507f1f77bcf86cd799439011" };
            const result: MockEntity = {
                // @ts-expect-error is a mock
                _id: "507f1f77bcf86cd799439011",
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(service, "updateStatus").mockResolvedValue(result);

            // @ts-expect-error testing purposes
            expect(await controller.unarchive(params)).toBe(result);
            expect(service.updateStatus).toHaveBeenCalledWith(
                new mongoose.Schema.Types.ObjectId(params.id),
                false,
            );
        });
    });

    describe("delete", () => {
        it("should call service.delete with correct parameters", async () => {
            const params = { id: "507f1f77bcf86cd799439011" };
            jest.spyOn(service, "delete").mockResolvedValue(undefined);

            // @ts-expect-error testing purposes
            await controller.delete(params);
            expect(service.delete).toHaveBeenCalledWith(
                new mongoose.Schema.Types.ObjectId(params.id),
            );
        });
    });
});
