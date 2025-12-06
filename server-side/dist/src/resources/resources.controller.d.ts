import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    create(createResourceDto: CreateResourceDto): Promise<import("mongoose").Document<unknown, {}, import("./entities/resource.entity").Resources, {}, {}> & import("./entities/resource.entity").Resources & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./entities/resource.entity").Resources, {}, {}> & import("./entities/resource.entity").Resources & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./entities/resource.entity").Resources, {}, {}> & import("./entities/resource.entity").Resources & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<(import("mongoose").Document<unknown, {}, import("./entities/resource.entity").Resources, {}, {}> & import("./entities/resource.entity").Resources & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./entities/resource.entity").Resources, {}, {}> & import("./entities/resource.entity").Resources & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
