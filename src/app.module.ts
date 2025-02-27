import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ExampleMiddlewareModule } from "./example-middleware/example-middleware.module";
import { ExampleControllerController } from "./example-controller/example-controller.controller";
import { ExampleModuleModule } from "./example-module/example-module.module";
import { ExampleFilterModule } from "./example-filter/example-filter.module";
import { ExamplePipelineModule } from "./example-pipeline/example-pipeline.module";
import { ExampleGuardModule } from "./example-guard/example-guard.module";
import { ExampleInterceptorModule } from "./example-interceptor/example-interceptor.module";

@Module({
    imports: [
        ExampleMiddlewareModule,
        ExampleModuleModule,
        ExampleFilterModule,
        ExamplePipelineModule,
        ExampleGuardModule,
        ExampleInterceptorModule
    ],
    controllers: [AppController, ExampleControllerController],
    providers: [AppService],
})
export class AppModule {}
