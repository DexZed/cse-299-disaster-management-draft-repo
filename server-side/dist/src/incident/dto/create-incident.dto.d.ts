import { z } from 'zod';
export declare const CreateIncidentDTO: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    resourceType: z.ZodEnum<{
        FOOD: "FOOD";
        MEDICAL: "MEDICAL";
        RESCUE: "RESCUE";
        SHELTER: "SHELTER";
    }>;
    unitsRequired: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const AssignVolunteerDTO: z.ZodObject<{
    volunteerIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
declare const CreateIncidentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    resourceType: z.ZodEnum<{
        FOOD: "FOOD";
        MEDICAL: "MEDICAL";
        RESCUE: "RESCUE";
        SHELTER: "SHELTER";
    }>;
    unitsRequired: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>> & {
    io: "input";
};
export declare class CreateIncidentDto extends CreateIncidentDto_base {
}
declare const AssignVolunteerDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    volunteerIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>> & {
    io: "input";
};
export declare class AssignVolunteerDto extends AssignVolunteerDto_base {
}
export {};
