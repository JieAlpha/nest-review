import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Request } from "express";
import { SetMetadata } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';

// 自定义装饰器的元数据 key
export const ROLES_KEY = "roles";
export const PUBLIC_KEY = "isPublic";

// 角色枚举
export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    GUEST = "guest",
}

// 角色装饰器
export const Roles = (...roles: UserRole[]) => {
    return SetMetadata(ROLES_KEY, roles);
};

// 公共路由装饰器
export const Public = () => {
    return SetMetadata(PUBLIC_KEY, true);
};

@Injectable()
export class ExampleGuardGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService, // 注入 JwtService
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // 获取请求对象
        const request = context.switchToHttp().getRequest<Request>();

        // 检查是否是公共路由
        const isPublic = this.reflector.get<boolean>(
            PUBLIC_KEY,
            context.getHandler(),
        );
        if (isPublic) {
            return true;
        }

        // 获取路由所需角色
        const requiredRoles = this.reflector.get<UserRole[]>(
            ROLES_KEY,
            context.getHandler(),
        );

        // 检查请求头中的认证信息
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException("未提供认证信息");
        }

        try {
            // 验证 token（示例）
            const token = authHeader.split(" ")[1];
            const user = this.validateToken(token);

            // 将用户信息附加到请求对象
            request["user"] = user;

            // 如果没有指定所需角色，只要认证通过就允许访问
            if (!requiredRoles) {
                return true;
            }

            // 检查用户角色权限
            // 检查用户是否具有所需角色
            return requiredRoles.some(role => user.role === role);
        } catch (error) {
            throw new UnauthorizedException("无效的认证信息");
        }
    }

    private validateToken(token: string): any {
        try {
            // 验证 JWT token
            const payload = this.jwtService.verify(token, {
                secret: 'your-secret-key', // 建议使用环境变量存储密钥
            });

            // 验证 token 是否过期
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                throw new UnauthorizedException('Token 已过期');
            }

            // 验证用户角色
            if (!payload.role || !Object.values(UserRole).includes(payload.role)) {
                throw new UnauthorizedException('无效的用户角色');
            }

            return {
                id: payload.sub,
                role: payload.role as UserRole,
                username: payload.username,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('无效的 token');
        }
    }
}

// 速率限制守卫
@Injectable()
export class RateLimitGuard implements CanActivate {
    private readonly requestMap = new Map<string, number[]>();

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const ip = request.ip;
        const now = Date.now();
        const windowMs = 60000; // 1分钟窗口
        const maxRequests = 20; // 最大请求数

        // 获取该 IP 的请求历史
        const requests = this.requestMap.get(ip ?? "") || [];

        // 清理超出时间窗口的请求记录
        const recentRequests = requests.filter((time) => now - time < windowMs);

        if (recentRequests.length >= maxRequests) {
            throw new ForbiddenException("请求过于频繁，请稍后再试");
        }

        // 记录新的请求
        recentRequests.push(now);
        this.requestMap.set(ip ?? "", recentRequests);

        return true;
    }
}

// 缓存守卫
@Injectable()
export class CacheGuard implements CanActivate {
    private cache = new Map<string, { data: any; timestamp: number }>();

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const cacheKey = request.url;
        const cacheDuration = 60000; // 1分钟缓存

        const cachedData = this.cache.get(cacheKey);
        const now = Date.now();

        if (cachedData && now - cachedData.timestamp < cacheDuration) {
            // 返回缓存的响应
            const response = context.switchToHttp().getResponse();
            response.send(cachedData.data);
            return false;
        }

        // 在请求对象上添加缓存方法
        request["setCache"] = (data: any) => {
            this.cache.set(cacheKey, { data, timestamp: now });
        };

        return true;
    }
}
