"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIncidentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_incident_dto_1 = require("./create-incident.dto");
class UpdateIncidentDto extends (0, mapped_types_1.PartialType)(create_incident_dto_1.CreateIncidentDto) {
}
exports.UpdateIncidentDto = UpdateIncidentDto;
//# sourceMappingURL=update-incident.dto.js.map