import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ExampleGuardGuard } from "./example-guard.guard";
import { ExampleGuardController } from "./example-guard.controller";
import { ExampleGuardService } from "./example.service";

@Module({
    imports: [
        JwtModule.register({
            secret: "your-secret-key", // 建议使用环境变量
            signOptions: {
                expiresIn: 60, // token 过期时间
            },
        }),
    ],
    controllers: [ExampleGuardController],
    providers: [ExampleGuardGuard, ExampleGuardService],
    exports: [ExampleGuardGuard],
})
export class ExampleGuardModule {}
