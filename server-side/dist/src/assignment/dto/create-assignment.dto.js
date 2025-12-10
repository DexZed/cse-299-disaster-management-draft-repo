"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssignmentStatusDto = exports.UpdateAssignmentStatusDTO = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.UpdateAssignmentStatusDTO = zod_1.z.object({
    status: zod_1.z.enum(['ON_ROUTE', 'COMPLETED'])
});
class UpdateAssignmentStatusDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateAssignmentStatusDTO) {
}
exports.UpdateAssignmentStatusDto = UpdateAssignmentStatusDto;
//# sourceMappingURL=create-assignment.dto.js.map