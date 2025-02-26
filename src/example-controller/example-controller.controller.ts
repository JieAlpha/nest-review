import {
    All,
    Body,
    Controller,
    Delete,
    Get,
    Head,
    Header,
    HttpCode,
    Options,
    // Param,
    Patch,
    Post,
    Put,
    Query,
    Redirect,
    Req,
    Res,
    Session,
} from "@nestjs/common";
import { Request, Response } from "express";

@Controller("example-controller")
export class ExampleControllerController {
    constructor() {}
    @Get("get")
    get() {
        return "get";
    }
    // 展示路由参数功能
    // @Get('get/:id')
    // getById(@Param('id') id: string) {
    //   return `get id ${id}`;
    // }
    // 展示查询参数功能
    @Get("get/query")
    getQuery(@Query() query: any) {
        return "get query " + JSON.stringify(query);
    }
    // 展示状态码功能
    @Get("get/status")
    @HttpCode(201)
    get201() {
        return "get 201";
    }
    // 展示Session功能
    @Get("get/session")
    getSession(@Session() session: any) {
        return "get session " + JSON.stringify(session);
    }
    // 手动管理请求和响应
    @Get("get/manual")
    getManual(@Req() req: Request, @Res() res: Response) {
        console.log("get manual " + JSON.stringify(req.ip));
        res.send("get manual");
        res.end();
    }
    // 重定向功能
    @Get("get/redirect")
    @Redirect("https://www.baidu.com", 301)
    getRedirect() {
        return "get redirect";
    }
    // 展示异步性
    @Get("get/async")
    async getAsync() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("get async");
            }, 1000);
        });
    }
    // 展示路由通配符
    // @Get('get/*w')
    // getWildcard() {
    //   return 'get wildcard';
    // }
    // 自定义响应头
    @Get("get/header")
    @Header("a", "b")
    getHeader(@Res() res: Response) {
        res.set("test", "test");
        res.end();
        return "get header";
    }
    @Post("post")
    post() {
        return "post";
    }
    // 展示Body功能
    @Post("post/body")
    postBody(@Body() body: any) {
        console.log(body);
        return "";
    }
    // 展示复杂数据负载的获取和复杂数据响应
    @Post("post/complex")
    postComplex(@Body() body: any, @Req() req: Request, @Res() res: Response) {
        console.log("post complex " + JSON.stringify(body));
        res.send("post complex");
        res.end();
    }
    @Put("put")
    put() {
        return "put";
    }
    @Delete("delete")
    delete() {
        return "delete";
    }
    @Patch("patch")
    patch() {
        return "patch";
    }
    @Options("options")
    options() {
        return "options";
    }
    @Head("head")
    head() {
        return "head";
    }
    @All("all")
    all() {
        return "all";
    }
}
