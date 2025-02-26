import {
    Module,
    NestModule,
    MiddlewareConsumer,
    RequestMethod,
} from "@nestjs/common";
import { ExampleMiddlewareMiddleware } from "./example-middleware.middleware";
import { ExampleMiddlewareController } from "./example-middleware.controller";

@Module({
    controllers: [ExampleMiddlewareController],
})
export class ExampleMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ExampleMiddlewareMiddleware)
            .exclude({
                path: "example-middleware/excluded",
                method: RequestMethod.GET,
            })
            .forRoutes({
                path: "*example-middleware",
                method: RequestMethod.ALL,
            });
    }
}
