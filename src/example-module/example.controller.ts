import { Controller, Get, Inject } from "@nestjs/common";
import { DefaultBaseService, BaseService } from "./services/base.service";
import { InjectableService } from "./services/injectable.service";

@Controller("example")
export class ExampleController {
    constructor(
        @Inject("SUB_MODULE") private readonly subModule: string,
        @Inject("CUSTOM_SERVICE") private readonly customService: BaseService,
        @Inject("FACTORY_SERVICE") private readonly factoryService: BaseService,
        @Inject("SERVICE_ALIAS") private readonly aliasService: BaseService,
        private readonly defaultService: DefaultBaseService,
        private readonly injectableService: InjectableService, // 直接注入，不需要 @Inject()
    ) {}

    @Get()
    getAll() {
        return {
            subModule: this.subModule,
            defaultService: this.defaultService.getData(),
            customService: this.customService.getData(),
            factoryService: this.factoryService.getData(),
            aliasService: this.aliasService.getData(),
            injectableService: this.injectableService.getData(),
        };
    }
}
