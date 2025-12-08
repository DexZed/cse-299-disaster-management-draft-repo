"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResourceDto = exports.mongoSafeString = void 0;
const zod_1 = require("zod");
const nestjs_zod_1 = require("nestjs-zod");
exports.mongoSafeString = zod_1.z
    .string()
    .refine(val => !val.includes('$') && !val.includes('.'), {
    message: 'Invalid characters',
});
const ResourcesSchema = zod_1.z.object({
    name: exports.mongoSafeString,
    description: exports.mongoSafeString.optional(),
    quantity: zod_1.z.number(),
    status: zod_1.z.enum(['In-Use', 'Assigned', 'Out of Stock', 'Available']),
    longitude: zod_1.z.number(),
    latitude: zod_1.z.number(),
    image: zod_1.z.string().optional(),
    expiryDate: zod_1.z.date().optional(),
}).strict();
class CreateResourceDto extends (0, nestjs_zod_1.createZodDto)(ResourcesSchema) {
}
exports.CreateResourceDto = CreateResourceDto;
//# sourceMappingURL=create-resource.dto.js.map