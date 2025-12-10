"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const mongoose_1 = require("@nestjs/mongoose");
const resources_module_1 = require("./resources/resources.module");
const chat_module_1 = require("./chat/chat.module");
const location_module_1 = require("./location/location.module");
const incident_module_1 = require("./incident/incident.module");
const geo_module_1 = require("./geo/geo.module");
const assignment_module_1 = require("./assignment/assignment.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: configuration_1.validateEnv
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_DB_URL'),
                    onConnectionCreate: (connection) => {
                        connection.on('connected', () => console.log('connected'));
                        connection.on('open', () => console.log('open'));
                        connection.on('disconnected', () => console.log('disconnected'));
                        connection.on('reconnected', () => console.log('reconnected'));
                        connection.on('disconnecting', () => console.log('disconnecting'));
                        return connection;
                    },
                }),
            }),
            users_module_1.UsersModule,
            resources_module_1.ResourcesModule,
            chat_module_1.ChatModule,
            location_module_1.LocationModule,
            incident_module_1.IncidentModule,
            geo_module_1.GeoModule,
            assignment_module_1.AssignmentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map