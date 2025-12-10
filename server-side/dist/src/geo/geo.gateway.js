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
exports.GeoGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const geo_service_1 = require("./geo.service");
const create_geo_dto_1 = require("./dto/create-geo.dto");
const update_geo_dto_1 = require("./dto/update-geo.dto");
let GeoGateway = class GeoGateway {
    geoService;
    constructor(geoService) {
        this.geoService = geoService;
    }
    create(createGeoDto) {
        return this.geoService.create(createGeoDto);
    }
    findAll() {
        return this.geoService.findAll();
    }
    findOne(id) {
        return this.geoService.findOne(id);
    }
    update(updateGeoDto) {
        return this.geoService.update(updateGeoDto.id, updateGeoDto);
    }
    remove(id) {
        return this.geoService.remove(id);
    }
};
exports.GeoGateway = GeoGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('createGeo'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_geo_dto_1.CreateGeoDto]),
    __metadata("design:returntype", void 0)
], GeoGateway.prototype, "create", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllGeo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeoGateway.prototype, "findAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findOneGeo'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GeoGateway.prototype, "findOne", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateGeo'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_geo_dto_1.UpdateGeoDto]),
    __metadata("design:returntype", void 0)
], GeoGateway.prototype, "update", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeGeo'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GeoGateway.prototype, "remove", null);
exports.GeoGateway = GeoGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [geo_service_1.GeoService])
], GeoGateway);
//# sourceMappingURL=geo.gateway.js.map