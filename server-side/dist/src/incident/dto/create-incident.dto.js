"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignVolunteerDto = exports.CreateIncidentDto = exports.AssignVolunteerDTO = exports.CreateIncidentDTO = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const create_resource_dto_1 = require("../../resources/dto/create-resource.dto");
const zod_1 = require("zod");
exports.CreateIncidentDTO = zod_1.z.object({
    description: create_resource_dto_1.mongoSafeString.optional(),
    resourceType: zod_1.z.enum(['FOOD', 'MEDICAL', 'RESCUE', 'SHELTER']),
    unitsRequired: zod_1.z.number().int().positive().optional(),
    location: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number()
    }).optional()
});
exports.AssignVolunteerDTO = zod_1.z.object({
    volunteerIds: zod_1.z.array(zod_1.z.string().uuid())
});
class CreateIncidentDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateIncidentDTO) {
}
exports.CreateIncidentDto = CreateIncidentDto;
class AssignVolunteerDto extends (0, nestjs_zod_1.createZodDto)(exports.AssignVolunteerDTO) {
}
exports.AssignVolunteerDto = AssignVolunteerDto;
//# sourceMappingURL=create-incident.dto.js.map