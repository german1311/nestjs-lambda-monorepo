import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Type,
    UsePipes,
} from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import mongoose from "mongoose";
import { AbstractValidationPipe, ValidateObjectIdPipe } from "../pipes";
import { BaseEntity } from "./base.entity";
import { IBaseController } from "./interfaces/base-controller.interface";
import { IBaseService } from "./interfaces/base-service.interface";

export function BaseController<T extends BaseEntity, TCreateDto, TUpdateDto>(
    createDto: Type<TCreateDto>,
    updateDto: Type<TUpdateDto>,
): Type<IBaseController<T, TCreateDto, TUpdateDto>> {
    const createPipe = new AbstractValidationPipe(
        { whitelist: true, transform: true },
        { body: createDto },
    );
    const updatePipe = new AbstractValidationPipe(
        { whitelist: true, transform: true },
        { body: updateDto },
    );

    class GenericsController<T extends BaseEntity, createDto, updateDto>
        implements IBaseController<T, createDto, updateDto>
    {
        constructor(
            private readonly service: IBaseService<T, createDto, updateDto>,
        ) {}

        @Get("hello")
        getHello(): string {
            return ` ${process.env.npm_package_name} - ${process.env.npm_package_version}`;
        }

        @Get()
        async findAll(): Promise<T[]> {
            return this.service.findAll();
        }

        @Get("find/:id")
        @ApiBody({ required: true, description: "fetches the entity by ID" })
        async findOne(@Param(new ValidateObjectIdPipe("")) params): Promise<T> {
            const id = new mongoose.Schema.Types.ObjectId(params.id);
            return this.service.findOne(id);
        }

        @Post()
        @UsePipes(createPipe)
        async create(@Body() dto: createDto): Promise<T> {
            return this.service.create(dto);
        }

        @Put(":id")
        @UsePipes(updatePipe)
        async update(@Param("id") params, @Body() dto: updateDto): Promise<T> {
            return this.service.update(
                new mongoose.Schema.Types.ObjectId(params.id),
                dto,
            );
        }

        @Patch("archive/:id")
        async archive(@Param(new ValidateObjectIdPipe("")) params): Promise<T> {
            return this.service.updateStatus(
                new mongoose.Schema.Types.ObjectId(params.id),
                true,
            );
        }

        @Patch("unarchive/:id")
        async unarchive(
            @Param(new ValidateObjectIdPipe("")) params,
        ): Promise<T> {
            return this.service.updateStatus(
                new mongoose.Schema.Types.ObjectId(params.id),
                false,
            );
        }

        @Delete(":id")
        async delete(
            @Param(new ValidateObjectIdPipe("")) params,
        ): Promise<void> {
            return this.service.delete(
                new mongoose.Schema.Types.ObjectId(params.id),
            );
        }

        @Delete()
        async clear(): Promise<void> {
            return this.service.clear();
        }
    }

    return GenericsController;
}
