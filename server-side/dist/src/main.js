"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const globalErrorHandler_1 = require("./Global Erro Handler/globalErrorHandler");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    const httpAdapterHost = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new globalErrorHandler_1.CatchEverythingFilter(httpAdapterHost));
    app.enableCors();
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map