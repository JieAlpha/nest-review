import { Controller, Get, Post, Body } from "@nestjs/common";

@Controller("example-middleware")
export class ExampleMiddlewareController {
    @Get()
    getTest() {
        return { message: "这是一个 GET 请求测试" };
    }

    @Post()
    postTest(@Body() body: any) {
        return {
            message: "这是一个 POST 请求测试",
            receivedData: body,
        };
    }

    @Get("excluded")
    excludedRoute() {
        return { message: "这个路由被排除在中间件之外" };
    }
}
