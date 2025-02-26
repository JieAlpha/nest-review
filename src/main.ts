import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.useGlobalFilters(new ExampleFilterFilter()); // 全局过滤器
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
