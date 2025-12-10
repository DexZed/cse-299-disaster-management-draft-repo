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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentSchema = exports.Incident = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Incident = class Incident {
    createdBy;
    description;
    resourceType;
    unitsRequired;
    location;
    priority;
    status;
    assignedVolunteers;
};
exports.Incident = Incident;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", String)
], Incident.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Incident.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['FOOD', 'MEDICAL', 'RESCUE', 'SHELTER'], required: true }),
    __metadata("design:type", String)
], Incident.prototype, "resourceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Incident.prototype, "unitsRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    }),
    __metadata("design:type", Object)
], Incident.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' }),
    __metadata("design:type", String)
], Incident.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    }),
    __metadata("design:type", String)
], Incident.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Types.ObjectId, ref: 'User' }]),
    __metadata("design:type", Array)
], Incident.prototype, "assignedVolunteers", void 0);
exports.Incident = Incident = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Incident);
exports.IncidentSchema = mongoose_1.SchemaFactory.createForClass(Incident);
exports.IncidentSchema.index({ location: '2dsphere' });
//# sourceMappingURL=incident.entity.js.map