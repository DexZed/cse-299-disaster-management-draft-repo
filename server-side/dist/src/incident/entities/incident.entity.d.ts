import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
export type IncidentDocument = HydratedDocument<Incident>;
export declare class Incident {
    createdBy: string;
    description: string;
    resourceType: string;
    unitsRequired: number;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    priority: string;
    status: string;
    assignedVolunteers: string[];
}
export declare const IncidentSchema: import("mongoose").Schema<Incident, import("mongoose").Model<Incident, any, any, any, import("mongoose").Document<unknown, any, Incident, any, {}> & Incident & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Incident, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Incident>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Incident> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
