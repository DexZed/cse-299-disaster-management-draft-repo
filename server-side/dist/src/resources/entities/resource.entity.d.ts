import { HydratedDocument } from 'mongoose';
export type resourcesDocument = HydratedDocument<Resources>;
export declare enum Status {
    inUse = "In-Use",
    assigned = "Assigned",
    outOfStock = "Out of Stock",
    available = "Available"
}
export declare class Resources {
    name: string;
    description: string;
    quantity: number;
    status: string;
    latitude: number;
    longitude: number;
    expiryDate: Date;
    totalUnits: number;
    availableUnits: number;
}
export declare const ResourcesSchema: import("mongoose").Schema<Resources, import("mongoose").Model<Resources, any, any, any, import("mongoose").Document<unknown, any, Resources, any, {}> & Resources & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Resources, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Resources>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Resources> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
