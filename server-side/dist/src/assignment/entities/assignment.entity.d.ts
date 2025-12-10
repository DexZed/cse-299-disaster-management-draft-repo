import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
export type AssignmentDocument = HydratedDocument<Assignment>;
export declare class Assignment {
    incidentId: string;
    volunteerId: string;
    status: string;
    startedAt?: Date;
    completedAt?: Date;
}
export declare const AssignmentSchema: import("mongoose").Schema<Assignment, import("mongoose").Model<Assignment, any, any, any, import("mongoose").Document<unknown, any, Assignment, any, {}> & Assignment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Assignment, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Assignment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Assignment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
