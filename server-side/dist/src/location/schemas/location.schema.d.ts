import { Document, Types } from 'mongoose';
export type LocationDocument = Location & Document;
export declare enum HelpType {
    FOOD = "food",
    SHELTER = "shelter",
    MEDICAL_KIT = "medical_kit"
}
export declare enum Priority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare class Location {
    user_id: Types.ObjectId;
    description?: string;
    helpType: HelpType;
    priority: Priority;
    image?: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    updated_at?: Date;
}
export declare const LocationSchema: import("mongoose").Schema<Location, import("mongoose").Model<Location, any, any, any, Document<unknown, any, Location, any, {}> & Location & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Location, Document<unknown, {}, import("mongoose").FlatRecord<Location>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Location> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
