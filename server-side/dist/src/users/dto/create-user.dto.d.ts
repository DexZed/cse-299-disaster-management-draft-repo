import { z } from 'zod';
declare const CreateUserDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    role: z.ZodEnum<{
        admin: "admin";
        user: "user";
        affected: "affected";
        volunteer: "volunteer";
        victim: "victim";
    }>;
    profileImage: z.ZodOptional<z.ZodString>;
    isAuthenticated: z.ZodOptional<z.ZodBoolean>;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>> & {
    io: "input";
};
export declare class CreateUserDto extends CreateUserDto_base {
}
export {};
