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
var LocationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const location_service_1 = require("../location/location.service");
let LocationGateway = LocationGateway_1 = class LocationGateway {
    locationService;
    server;
    logger = new common_1.Logger(LocationGateway_1.name);
    constructor(locationService) {
        this.locationService = locationService;
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    broadcastLocation(payload) {
        this.server.emit('location_update', payload);
    }
    async handleSendGps(payload, client) {
        try {
            const updated = await this.locationService.updateLocation(payload);
            const broadcast = {
                user_id: updated.user_id?._id ?? updated.user_id,
                name: updated.user_id?.name ?? null,
                role: updated.user_id?.role ?? null,
                latitude: updated.latitude,
                longitude: updated.longitude,
                updated_at: updated.updated_at,
                description: updated.description,
                helpType: updated.helpType,
                priority: updated.priority,
                image: updated.image,
            };
            this.server.emit('location_update', broadcast);
            client.emit('location_ack', { status: 'ok', location: broadcast });
            return { status: 'ok' };
        }
        catch (err) {
            this.logger.error('Error processing send_gps', err?.message ?? err);
            client.emit('location_error', { message: err?.message ?? 'Error' });
            return { status: 'error', message: err?.message ?? 'Error' };
        }
    }
};
exports.LocationGateway = LocationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], LocationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_gps'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], LocationGateway.prototype, "handleSendGps", null);
exports.LocationGateway = LocationGateway = LocationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', credentials: false },
        namespace: '/location',
    }),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], LocationGateway);
exports.default = LocationGateway;
//# sourceMappingURL=location.gateway.js.map