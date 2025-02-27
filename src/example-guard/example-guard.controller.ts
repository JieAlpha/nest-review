import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import {
    ExampleGuardGuard,
    RateLimitGuard,
    CacheGuard,
} from "./example-guard.guard";
import { Roles, UserRole, Public } from "./example-guard.guard";
import { ExampleGuardService } from "./example.service";

@Controller("example-guard")
@UseGuards(ExampleGuardGuard, RateLimitGuard)
export class ExampleGuardController {
    constructor(private readonly exampleGuardService: ExampleGuardService) {}
    @Get("public")
    @Public()
    async getPublicData() {
        // 这里的代码不会被 ExampleGuardGuard 拦截
        const token = await this.exampleGuardService.generateToken({
            id: 1,
            username: "admin",
            role: UserRole.ADMIN,
        });
        return { message: "这是公开数据" , token };
    }

    @Get("user")
    @Roles(UserRole.USER)
    getUserData() {
        return { message: "这是用户数据" };
    }

    @Get("admin")
    @Roles(UserRole.ADMIN)
    getAdminData() {
        return { message: "这是管理员数据" };
    }

    @Get("cached")
    @Public()
    @UseGuards(CacheGuard)
    getCachedData(@Req() request: Request) {
        const data = { message: "这是缓存数据", timestamp: Date.now() };
        // 设置缓存
        request["setCache"](data);
        return data;
    }
}
