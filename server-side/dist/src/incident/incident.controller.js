"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentController = void 0;
const common_1 = require("@nestjs/common");
const incident_service_1 = require("./incident.service");
const create_incident_dto_1 = require("./dto/create-incident.dto");
const update_incident_dto_1 = require("./dto/update-incident.dto");
let IncidentController = class IncidentController {
    incidentService;
    constructor(incidentService) {
        this.incidentService = incidentService;
    }
    create(createIncidentDto) {
        return this.incidentService.create(createIncidentDto);
    }
    findAll() {
        return this.incidentService.findAll();
    }
    findOne(id) {
        return this.incidentService.findOne(+id);
    }
    update(id, updateIncidentDto) {
        return this.incidentService.update(+id, updateIncidentDto);
    }
    remove(id) {
        return this.incidentService.remove(+id);
    }
};
exports.IncidentController = IncidentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_incident_dto_1.CreateIncidentDto]),
    __metadata("design:returntype", void 0)
], IncidentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IncidentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncidentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_incident_dto_1.UpdateIncidentDto]),
    __metadata("design:returntype", void 0)
], IncidentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncidentController.prototype, "remove", null);
exports.IncidentController = IncidentController = __decorate([
    (0, common_1.Controller)('incident'),
    __metadata("design:paramtypes", [incident_service_1.IncidentService])
], IncidentController);
//# sourceMappingURL=incident.controller.js.map