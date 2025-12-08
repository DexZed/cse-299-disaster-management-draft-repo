"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const create_resource_dto_1 = require("../../resources/dto/create-resource.dto");
const zod_1 = require("zod");
const UserSchema = zod_1.z.object({
    name: create_resource_dto_1.mongoSafeString,
    email: zod_1.z.email(),
    password: create_resource_dto_1.mongoSafeString,
    role: zod_1.z.enum(['admin', 'user', 'affected', 'volunteer', 'victim']),
    profileImage: create_resource_dto_1.mongoSafeString.optional(),
    isAuthenticated: zod_1.z.boolean().optional(),
    rememberMe: zod_1.z.boolean().optional(),
}).strict();
class CreateUserDto extends (0, nestjs_zod_1.createZodDto)(UserSchema) {
}
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map