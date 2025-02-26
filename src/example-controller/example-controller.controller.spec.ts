import { Test, TestingModule } from "@nestjs/testing";
import { ExampleControllerController } from "./example-controller.controller";

describe("ExampleControllerController", () => {
    let controller: ExampleControllerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExampleControllerController],
        }).compile();

        controller = module.get<ExampleControllerController>(
            ExampleControllerController,
        );
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
