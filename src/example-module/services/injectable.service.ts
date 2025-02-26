import { Injectable } from "@nestjs/common";

@Injectable()
export class InjectableService {
    private count = 0;

    getData(): string {
        this.count++;
        return `这是一个使用 @Injectable 装饰器的服务 - 被调用次数: ${this.count}`;
    }
}
