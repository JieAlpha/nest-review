import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ExampleMiddlewareModule } from "./example-middleware/example-middleware.module";
import { ExampleControllerController } from "./example-controller/example-controller.controller";
import { ExampleModuleModule } from "./example-module/example-module.module";
import { ExampleFilterModule } from "./example-filter/example-filter.module";

@Module({
    imports: [ExampleMiddlewareModule, ExampleModuleModule, ExampleFilterModule],
    controllers: [AppController, ExampleControllerController],
    providers: [AppService],
})
export class AppModule {}
