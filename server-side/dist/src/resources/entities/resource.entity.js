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
exports.ResourcesSchema = exports.Resources = exports.Status = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var Status;
(function (Status) {
    Status["inUse"] = "In-Use";
    Status["assigned"] = "Assigned";
    Status["outOfStock"] = "Out of Stock";
    Status["available"] = "Available";
})(Status || (exports.Status = Status = {}));
let Resources = class Resources {
    name;
    description;
    quantity;
    status;
    latitude;
    longitude;
    expiryDate;
};
exports.Resources = Resources;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Resources.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Resources.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Resources.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Status, default: Status.available }),
    __metadata("design:type", String)
], Resources.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Resources.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Resources.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Resources.prototype, "expiryDate", void 0);
exports.Resources = Resources = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false, strict: true }),
    (0, mongoose_1.Schema)()
], Resources);
exports.ResourcesSchema = mongoose_1.SchemaFactory.createForClass(Resources);
//# sourceMappingURL=resource.entity.js.map