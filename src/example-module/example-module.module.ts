import { Module } from "@nestjs/common";
import { SubModuleModule } from "./sub-module";
import { ExampleController } from "./example.controller";

@Module({
    imports: [SubModuleModule],
    controllers: [ExampleController],
})
export class ExampleModuleModule {}
