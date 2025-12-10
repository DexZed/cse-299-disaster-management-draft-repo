"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGeoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_geo_dto_1 = require("./create-geo.dto");
class UpdateGeoDto extends (0, mapped_types_1.PartialType)(create_geo_dto_1.CreateGeoDto) {
    id;
}
exports.UpdateGeoDto = UpdateGeoDto;
//# sourceMappingURL=update-geo.dto.js.map