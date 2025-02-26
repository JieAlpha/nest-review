import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    UseFilters,
} from "@nestjs/common";
import { ExampleFilterFilter } from "./example-filter.filter";

@Controller("example-filter")
// @UseFilters(ExampleFilterFilter)  // 应用于整个控制器
export class ExampleFilterController {
    @Get()
    findAll() {
        // 模拟一个成功的请求
        return ["item1", "item2"];
    }

    @Get("error")
    @UseFilters(ExampleFilterFilter) // 只应用于这个特定方法
    throwError() {
        // 抛出一个 HTTP 异常
        throw new HttpException(
            "这是一个自定义错误消息",
            HttpStatus.BAD_REQUEST,
        );
    }

    @Get("server-error")
    throwServerError() {
        // 模拟一个未处理的服务器错误
        throw new Error("这是一个服务器内部错误");
    }

    @Get("custom/:id")
    findOne(@Param("id") id: string) {
        if (id === "0") {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: "不能访问 ID 为 0 的资源",
                    additionalInfo: "这是一些额外信息",
                },
                HttpStatus.FORBIDDEN,
            );
        }
        return `Item ${id}`;
    }
}
