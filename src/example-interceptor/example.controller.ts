import { Controller, Get, UseInterceptors } from "@nestjs/common";
import {
    LoggingInterceptor,
    TransformInterceptor,
    ErrorsInterceptor,
    TimeoutInterceptor,
    CacheInterceptor,
    ExcludeNullInterceptor,
} from "./example-interceptor.interceptor";

@Controller("example-interceptor")
@UseInterceptors(LoggingInterceptor, ErrorsInterceptor)
export class ExampleController {
    @Get()
    @UseInterceptors(TransformInterceptor)
    findAll() {
        return ["item1", "item2"];
    }

    @Get("cached")
    @UseInterceptors(CacheInterceptor)
    getCachedData() {
        return { message: "这是缓存数据" };
    }

    @Get("timeout")
    @UseInterceptors(TimeoutInterceptor)
    async getSlowData() {
        await new Promise((resolve) => setTimeout(resolve, 6000));
        return { message: "这是慢速数据" };
    }

    @Get("filter")
    @UseInterceptors(ExcludeNullInterceptor)
    getFilteredData() {
        return [1, null, 2, null, 3];
    }
}
