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
var LocationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const location_schema_1 = require("./schemas/location.schema");
let LocationService = LocationService_1 = class LocationService {
    locationModel;
    userModel;
    logger = new common_1.Logger(LocationService_1.name);
    constructor(locationModel, userModel) {
        this.locationModel = locationModel;
        this.userModel = userModel;
    }
    async updateLocation(dto) {
        const user_id = dto.user_id;
        const latitude = dto.latitude;
        const longitude = dto.longitude;
        const accuracy = dto.accuracy;
        const description = dto.description;
        const helpType = dto.helpType;
        const priority = dto.priority;
        const image = dto.image;
        const userId = new mongoose_2.Types.ObjectId(user_id);
        const user = await this.userModel.findById(userId).lean();
        if (!user) {
            throw new Error('User not found');
        }
        const update = {
            latitude,
            longitude,
            accuracy,
            updated_at: new Date(),
            user_id,
            description,
            helpType,
            priority,
            image,
        };
        const loc = await this.locationModel.findOneAndUpdate({ user_id }, { $set: update }, { upsert: true, new: true, setDefaultsOnInsert: true, strict: false }).populate('user_id', 'name role');
        this.logger.debug(`Location updated for user ${user_id}`);
        return loc;
    }
    async getVolunteers() {
        const docs = await this.locationModel.find().populate({
            path: 'user_id',
            match: { role: 'volunteer' },
            select: 'name role',
        });
        return docs.filter(d => d.user_id !== null);
    }
    async getAffected() {
        const docs = await this.locationModel.find().populate({
            path: 'user_id',
            match: { role: 'affected' },
            select: 'name role',
        });
        return docs.filter(d => d.user_id !== null);
    }
    async getAllLocations() {
        const docs = await this.locationModel.find().populate('user_id', 'name role');
        return docs.map(d => ({
            user_id: d.user_id?._id ?? null,
            name: d.user_id?.name ?? null,
            role: d.user_id?.role ?? null,
            latitude: d.latitude,
            longitude: d.longitude,
            updated_at: d.updated_at,
            description: d.description,
            helpType: d.helpType,
            priority: d.priority,
            image: d.image,
        }));
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = LocationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(location_schema_1.Location.name)),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], LocationService);
//# sourceMappingURL=location.service.js.map