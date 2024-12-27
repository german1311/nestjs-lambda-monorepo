import { ObjectId } from "mongoose";

export interface IBaseService<T, createDto, updateDto> {
    findAll(): Promise<T[]>;
    create(entity: createDto): Promise<T>;
    update(_id: ObjectId, entity: updateDto): Promise<T>;
    findOne(_id: ObjectId): Promise<T>;
    delete(_id: ObjectId): Promise<void>;
    updateStatus(_id: ObjectId, isDeleted: boolean): Promise<T>;
    clear(): Promise<void>;
}
