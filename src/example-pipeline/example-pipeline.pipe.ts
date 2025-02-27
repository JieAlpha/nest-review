import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
    ParseIntPipe,
} from "@nestjs/common";
import { z } from "zod"; // zod 是一个强大的数据验证器
/**
// https://nest.nodejs.cn/techniques/validation#%E9%AA%8C%E8%AF%81
 * 也可使用 class-validator 和 class-transformer 库，它们与 Nest.js 集成得很好。
 */
// 用户创建 DTO 验证模式
const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    age: z.number().min(0).max(150),
});

type CreateUserDto = z.infer<typeof CreateUserSchema>;

@Injectable()
export class ExamplePipelinePipe implements PipeTransform {
    // 支持同步和异步转换
    async transform(value: any, metadata: ArgumentMetadata) {
        const { type, metatype, data } = metadata;

        // 根据参数类型进行不同的处理
        switch (type) {
            case "body":
                return this.transformBody(value, metatype);
            case "param":
                // 确保 data 不为 undefined
                return this.transformParam(value, data || "");
            case "query":
                // 确保 data 不为 undefined
                return this.transformQuery(value, data || "");
            default:
                return value;
        }
    }

    private async transformBody(value: any, metatype: any) {
        // 如果是用户创建请求，进行验证
        if (metatype?.name === "CreateUserDto") {
            try {
                return CreateUserSchema.parse(value);
            } catch (error) {
                throw new BadRequestException("用户数据验证失败");
            }
        }
        return value;
    }

    private async transformParam(value: string, paramName: string) {
        // 处理路由参数
        if (paramName === "id") {
            const parseIntPipe = new ParseIntPipe();
            try {
                return await parseIntPipe.transform(value, {
                    type: 'param',
                    metatype: Number,
                    data: 'id'
                });
            } catch (error) {
                throw new BadRequestException("ID必须是数字");
            }
        }
        return value;
    }

    private transformQuery(value: any, queryName: string) {
        // 处理查询参数
        if (queryName === "page") {
            const page = parseInt(value, 10);
            if (isNaN(page) || page < 1) {
                throw new BadRequestException("页码必须是大于0的数字");
            }
            return page;
        }
        if (queryName === "sort") {
            const allowedValues = ["asc", "desc"];
            if (!allowedValues.includes(value)) {
                throw new BadRequestException("排序只能是 asc 或 desc");
            }
            return value;
        }
        return value;
    }
}

// 自定义转换管道
@Injectable()
export class TrimPipe implements PipeTransform {
    transform(value: any) {
        if (typeof value === "string") {
            return value.trim();
        }
        if (typeof value === "object") {
            Object.keys(value).forEach((key) => {
                if (typeof value[key] === "string") {
                    value[key] = value[key].trim();
                }
            });
        }
        return value;
    }
}

// 自定义验证管道
@Injectable()
export class PositiveNumberPipe implements PipeTransform {
    transform(value: any) {
        const number = parseInt(value, 10);
        if (isNaN(number) || number <= 0) {
            throw new BadRequestException("值必须是正数");
        }
        return number;
    }
}
