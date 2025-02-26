import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { ExampleFilterFilter } from "./example-filter.filter";
import { ExampleFilterController } from "./example-filter.controller";

@Module({
    controllers: [ExampleFilterController],
    // 过滤器在模块中注册，如果被外部引用会在外部生效的，过滤器一般直接使用在注解中
})
export class ExampleFilterModule {}
