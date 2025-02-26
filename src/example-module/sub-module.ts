import { Module } from "@nestjs/common";
import { DefaultBaseService, CustomBaseService } from "./services/base.service";
import { InjectableService } from "./services/injectable.service";

// 工厂函数的配置接口
interface ServiceConfig {
    isCustom: boolean;
}

@Module({
    providers: [
        // 1. 基本的字符串令牌 provider (useValue)
        {
            provide: "SUB_MODULE",
            useValue: "Sub Module",
        },

        // 2. 类 provider (useClass) - 标准写法
        {
            provide: DefaultBaseService,
            useClass: DefaultBaseService,
        },

        // 3. 类 provider (useClass) - 别名写法
        {
            provide: "CUSTOM_SERVICE",
            useClass: CustomBaseService,
        },

        // 4. 工厂 provider (useFactory)
        {
            provide: "FACTORY_SERVICE",
            useFactory: (config: ServiceConfig) => {
                console.log("config = ", config);
                return config.isCustom
                    ? new CustomBaseService()
                    : new DefaultBaseService();
            },
            inject: ["CONFIG"], // 注入依赖
        },

        // 5. 提供工厂函数所需的配置
        {
            provide: "CONFIG",
            useValue: { isCustom: false } as ServiceConfig,
        },

        // 6. 别名 provider (useExisting)
        {
            provide: "SERVICE_ALIAS",
            useExisting: DefaultBaseService,
        },

        // 7. 使用 @Injectable 装饰器的服务
        InjectableService, // 简写形式，等同于 { provide: InjectableService, useClass: InjectableService }
    ],
    exports: [
        "SUB_MODULE",
        DefaultBaseService,
        "CUSTOM_SERVICE",
        "FACTORY_SERVICE",
        "SERVICE_ALIAS",
        InjectableService, // 记得导出新添加的服务
    ],
})
export class SubModuleModule {}
