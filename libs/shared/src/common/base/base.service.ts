import { HttpException } from "@nestjs/common";
import { FilterQuery, Model, ObjectId } from "mongoose";
import { BaseEntity } from "./base.entity";
import { BaseCreateDto } from "./dtos/create-base.dto";
import { BaseUpdateDto } from "./dtos/update-base.dto";
import { IBaseService } from "./interfaces/base-service.interface";

export abstract class BaseService<
    T extends BaseEntity,
    createDto extends BaseCreateDto,
    updateDto extends BaseUpdateDto,
> implements IBaseService<T, createDto, updateDto>
{
    constructor(private readonly repository: Model<T>) {}

    async findAll(
        condition: FilterQuery<T> = { isDeleted: false },
    ): Promise<T[]> {
        const where: FilterQuery<T> = { ...condition };

        return this.repository.find(where).exec();
    }

    async findOne(_id: ObjectId): Promise<T> {
        const entity = await this.repository.findById(_id);
        if (!entity)
            throw new HttpException(`Entity with ID ${_id} not found`, 404);

        return entity;
    }

    private createObject(dto: createDto | updateDto): T {
        const newEntity = {} as T;
        return Object.assign(newEntity, dto);
    }

    /**
     *
     * @param data : the CreateDTO of the submitted entity
     * @returns : The created entity
     */
    async create(data: createDto): Promise<T> {
        const newEntity = this.createObject(data);
        newEntity.isDeleted = false;
        const entity = await this.repository.create(newEntity as T);
        return this.repository.create(entity as T);
    }

    /**
     *
     * @param _id : the ID of the entity
     * @param dto : the DTO to be assigned for the entity
     * @returns : The modified entity
     */
    async update(_id: ObjectId, dto: updateDto): Promise<T> {
        const newEntity = this.createObject(dto);

        const currentEntity = await this.repository.findByIdAndUpdate(
            _id,
            newEntity as T,
        );

        return currentEntity;
    }

    async delete(_id: ObjectId): Promise<void> {
        await this.repository.findByIdAndDelete(_id);
    }

    /**
     *
     * @param _id : ObjectID of the given entity
     * This method applies logical deletion or restoration from the database by setting the isDeleted to true or false
     */
    async updateStatus(_id: ObjectId, isDeleted: boolean): Promise<T> {
        const entity = await this.repository.findByIdAndUpdate(_id, {
            isDeleted: isDeleted,
        });
        if (!entity)
            throw new TypeError(`Entity with ID ${_id.toString()} not found`);
        return entity;
    }

    /**
     * This method deletes permanently from the database
     */
    async clear(): Promise<void> {
        try {
            await this.repository.deleteMany();
        } catch (error) {
            if (error.name === "MongoError" && error.code === 26) {
                // Handle "is not found" error
                // Perform alternative logic or error handling
                console.error("Collection does not exist. Unable to clear.");
            } else {
                // Handle other errors
                console.error("An error occurred:", error);
            }

            throw error;
        }
    }
}
