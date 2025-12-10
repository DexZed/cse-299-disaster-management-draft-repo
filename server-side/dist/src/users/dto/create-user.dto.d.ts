import { z } from 'zod';
declare const CreateUserDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        admin: "admin";
        user: "user";
        affected: "affected";
        volunteer: "volunteer";
        victim: "victim";
    }>>;
    profileImage: z.ZodOptional<z.ZodString>;
    isAuthenticated: z.ZodOptional<z.ZodBoolean>;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>> & {
    io: "input";
};
export declare class CreateUserDto extends CreateUserDto_base {
}
export {};
