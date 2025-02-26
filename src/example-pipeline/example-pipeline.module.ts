import { Module } from "@nestjs/common";
import { ExamplePipelineController } from "./example-pipeline.controller";

@Module({
    controllers: [ExamplePipelineController],
})
export class ExamplePipelineModule {}