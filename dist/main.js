"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.ORIGIN,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const port = process.env.PORT ?? 5000;
    await app.listen(port);
    console.log(`running in ${port} port`);
    console.log(`server runing in http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map