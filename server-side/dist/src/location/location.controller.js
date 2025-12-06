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
exports.LocationController = void 0;
const common_1 = require("@nestjs/common");
const update_location_dto_1 = require("./dto/update-location.dto");
const location_gateway_1 = require("../gateway/location.gateway");
const location_service_1 = require("./location.service");
let LocationController = class LocationController {
    locationService;
    gateway;
    constructor(locationService, gateway) {
        this.locationService = locationService;
        this.gateway = gateway;
    }
    async update(body) {
        try {
            const updated = await this.locationService.updateLocation(body);
            this.gateway.broadcastLocation({
                user_id: updated.user_id._id ?? updated.user_id,
                name: updated.user_id?.name ?? null,
                role: updated.user_id?.role ?? null,
                latitude: updated.latitude,
                longitude: updated.longitude,
                updated_at: updated.updated_at,
            });
            return { message: 'Location updated', location: updated };
        }
        catch (err) {
            throw new common_1.HttpException(err.message || 'Error', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    getVolunteers() {
        return this.locationService.getVolunteers();
    }
    getAffected() {
        return this.locationService.getAffected();
    }
    getAll() {
        return this.locationService.getAllLocations();
    }
};
exports.LocationController = LocationController;
__decorate([
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('volunteers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationController.prototype, "getVolunteers", null);
__decorate([
    (0, common_1.Get)('affected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationController.prototype, "getAffected", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationController.prototype, "getAll", null);
exports.LocationController = LocationController = __decorate([
    (0, common_1.Controller)('location'),
    __metadata("design:paramtypes", [location_service_1.LocationService,
        location_gateway_1.LocationGateway])
], LocationController);
//# sourceMappingURL=location.controller.js.map