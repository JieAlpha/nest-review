import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UsePipes,
    ParseIntPipe,
} from "@nestjs/common";
import {
    ExamplePipelinePipe,
    TrimPipe,
    PositiveNumberPipe,
} from "./example-pipeline.pipe";

@Controller("example-pipeline")
export class ExamplePipelineController {
    @Post("user")
    @UsePipes(new TrimPipe(), new ExamplePipelinePipe())
    createUser(@Body() createUserDto: any) {
        return createUserDto;
    }

    @Get(":id")
    @UsePipes(new ExamplePipelinePipe())
    findOne(
        @Param("id") id: number,
        @Query("page", PositiveNumberPipe) page: number,
        @Query("sort") sort: string,
    ) {
        return { id, page, sort };
    }

    // 组合多个管道
    @Get("combined/:number")
    getWithCombinedPipes(
        @Param("number", PositiveNumberPipe, ParseIntPipe) number: number,
    ) {
        return { number };
    }
}
