import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resources } from './entities/resource.entity';
import { Model, Types } from 'mongoose';
export declare class ResourcesService {
    private resourcesModel;
    constructor(resourcesModel: Model<Resources>);
    create(createResourceDto: CreateResourceDto): Promise<import("mongoose").Document<unknown, {}, Resources, {}, {}> & Resources & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Resources, {}, {}> & Resources & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, Resources, {}, {}> & Resources & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<(import("mongoose").Document<unknown, {}, Resources, {}, {}> & Resources & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, Resources, {}, {}> & Resources & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
