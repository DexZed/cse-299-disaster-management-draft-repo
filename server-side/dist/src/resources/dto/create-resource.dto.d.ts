import { z } from 'zod';
export declare const mongoSafeString: z.ZodString;
declare const CreateResourceDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    status: z.ZodEnum<{
        "In-Use": "In-Use";
        Assigned: "Assigned";
        "Out of Stock": "Out of Stock";
        Available: "Available";
    }>;
    longitude: z.ZodNumber;
    latitude: z.ZodNumber;
    image: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodDate>;
}, z.core.$strict>> & {
    io: "input";
};
export declare class CreateResourceDto extends CreateResourceDto_base {
}
export {};
