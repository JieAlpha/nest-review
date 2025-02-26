import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class ExampleMiddlewareMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // 记录请求开始时间
        const startTime = Date.now();

        // 记录请求信息
        console.log(
            `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
        );
        console.log("请求头:", req.headers);
        console.log("请求体:", req.body);

        // 为 response 添加自定义头
        res.setHeader("X-Custom-Header", "Nest-Middleware-Example");

        // 修改 response 的 end 方法来记录响应时间
        const originalEnd = res.end;
        res.end = function (this: Response, ...args: any[]): Response {
            const endTime = Date.now();
            const duration = endTime - startTime;

            console.log(`请求处理完成，耗时: ${duration}ms`);
            console.log("响应状态码:", res.statusCode);

            // 调用原始的 end 方法
            return originalEnd.apply(res, args);
        };

        next();
    }
}
