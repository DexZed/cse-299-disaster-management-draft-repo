import { z } from 'zod';
export declare const UpdateAssignmentStatusDTO: z.ZodObject<{
    status: z.ZodEnum<{
        ON_ROUTE: "ON_ROUTE";
        COMPLETED: "COMPLETED";
    }>;
}, z.core.$strip>;
declare const UpdateAssignmentStatusDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    status: z.ZodEnum<{
        ON_ROUTE: "ON_ROUTE";
        COMPLETED: "COMPLETED";
    }>;
}, z.core.$strip>> & {
    io: "input";
};
export declare class UpdateAssignmentStatusDto extends UpdateAssignmentStatusDto_base {
}
export {};
