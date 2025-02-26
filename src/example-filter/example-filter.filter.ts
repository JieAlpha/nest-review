import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(
  // HttpException
)
export class ExampleFilterFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // 获取状态码和错误信息
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : "服务器内部错误";

        // 构建错误响应
        const errorResponse = {
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            // 在开发环境下可以返回详细错误栈信息
            ...(process.env.NODE_ENV === "development" && {
                stack: exception instanceof Error ? exception.stack : undefined,
            }),
        };

        // 记录错误日志
        console.error("异常信息:", {
            ...errorResponse,
            headers: request.headers,
            body: request.body,
        });

        // 发送响应
        response.status(status).json(errorResponse);
    }
}
