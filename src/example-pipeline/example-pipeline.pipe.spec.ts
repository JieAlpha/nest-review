import { BadRequestException } from "@nestjs/common";
import { ExamplePipelinePipe } from "./example-pipeline.pipe";

describe("ExamplePipelinePipe", () => {
    let pipe: ExamplePipelinePipe;

    beforeEach(() => {
        pipe = new ExamplePipelinePipe();
    });

    describe('transformBody', () => {
        // 测试有效的用户数据
        it('should validate and return user data when metatype is CreateUserDto and data is valid', async () => {
            const validUserData = {
                username: 'testuser',
                email: 'test@example.com',
                age: 25
            };
            const metatype = { name: 'CreateUserDto' };

            // @ts-ignore - 访问私有方法
            const result = await pipe.transformBody(validUserData, metatype);

            expect(result).toEqual(validUserData);
        });

        // 测试无效的用户数据
        it('should throw BadRequestException when metatype is CreateUserDto and data is invalid', async () => {
            const invalidUserData = {
                username: 'te', // 用户名太短
                email: 'invalid-email', // 无效的邮箱
                age: 200 // 年龄超出范围
            };
            const metatype = { name: 'CreateUserDto' };

            // @ts-ignore - 访问私有方法
            await expect(pipe.transformBody(invalidUserData, metatype))
                .rejects
                .toThrow(BadRequestException);
        });

        // 测试非 CreateUserDto 类型的数据
        it('should return original value when metatype is not CreateUserDto', async () => {
            const value = { someData: 'test' };
            const metatype = { name: 'OtherDto' };

            // @ts-ignore - 访问私有方法
            const result = await pipe.transformBody(value, metatype);

            expect(result).toBe(value);
        });

        // 测试 metatype 为空的情况
        it('should return original value when metatype is undefined', async () => {
            const value = { someData: 'test' };
            const metatype = undefined;

            // @ts-ignore - 访问私有方法
            const result = await pipe.transformBody(value, metatype);

            expect(result).toBe(value);
        });

        // 测试边界情况的用户数据
        it('should validate boundary values for user data', async () => {
            const boundaryUserData = {
                username: 'abc', // 最小长度
                email: 'test@test.com',
                age: 0 // 最小年龄
            };
            const metatype = { name: 'CreateUserDto' };

            // @ts-ignore - 访问私有方法
            const result = await pipe.transformBody(boundaryUserData, metatype);

            expect(result).toEqual(boundaryUserData);
        });

        // 测试空对象
        it('should throw BadRequestException when data is empty object', async () => {
            const emptyData = {};
            const metatype = { name: 'CreateUserDto' };

            // @ts-ignore - 访问私有方法
            await expect(pipe.transformBody(emptyData, metatype))
                .rejects
                .toThrow(BadRequestException);
        });
    });
    describe('transformParam', () => {
        // 测试正常的数字ID转换
        it('should convert valid numeric ID string to number', async () => {
            const value = '123';
            const paramName = 'id';
            // @ts-ignore - 访问私有方法
            const result = await pipe.transformParam(value, paramName);
            expect(result).toBe(123);
        });

        // 测试非数字ID抛出异常
        it('should throw BadRequestException for non-numeric ID', async () => {
            const value = 'abc';
            const paramName = 'id';

            await expect(async () => {
                // @ts-ignore - 访问私有方法
                await pipe.transformParam(value, paramName);
            }).rejects.toThrow(BadRequestException);

            await expect(async () => {
                // @ts-ignore - 访问私有方法
                await pipe.transformParam(value, paramName);
            }).rejects.toThrow('ID必须是数字');
        });

        // 测试非ID参数直接返回原值
        it('should return original value for non-id params', async () => {
            const value = 'test-value';
            const paramName = 'other';
            // @ts-ignore - 访问私有方法
            const result = await pipe.transformParam(value, paramName);
            expect(result).toBe('test-value');
        });

        // 测试空字符串ID
        it('should throw BadRequestException for empty ID string', async () => {
            const value = '';
            const paramName = 'id';

            await expect(async () => {
                // @ts-ignore - 访问私有方法
                await pipe.transformParam(value, paramName);
            }).rejects.toThrow(BadRequestException);
        });

        // 测试特殊字符ID
        it('should throw BadRequestException for ID with special characters', async () => {
            const value = '123abc';
            const paramName = 'id';

            await expect(async () => {
                // @ts-ignore - 访问私有方法
                await pipe.transformParam(value, paramName);
            }).rejects.toThrow(BadRequestException);
        });
    });
    describe('transformQuery', () => {
        // 测试 page 参数
        describe('when queryName is "page"', () => {
            it('should return parsed page number when value is valid', async () => {
                // @ts-ignore - 私有方法测试
                const result = await pipe.transformQuery('5', 'page');
                expect(result).toBe(5);
            });

            it('should throw BadRequestException when page is less than 1', async () => {
                await expect(async () => {
                    // @ts-ignore - 私有方法测试
                    await pipe.transformQuery('0', 'page');
                }).rejects.toThrow(new BadRequestException('页码必须是大于0的数字'));
            });

            it('should throw BadRequestException when page is not a number', async () => {
                await expect(async () => {
                    // @ts-ignore - 私有方法测试
                    await pipe.transformQuery('abc', 'page');
                }).rejects.toThrow(new BadRequestException('页码必须是大于0的数字'));
            });
        });

        // 测试 sort 参数
        describe('when queryName is "sort"', () => {
            it('should return "asc" when value is "asc"', async () => {
                // @ts-ignore - 私有方法测试
                const result = await pipe.transformQuery('asc', 'sort');
                expect(result).toBe('asc');
            });

            it('should return "desc" when value is "desc"', async () => {
                // @ts-ignore - 私有方法测试
                const result = await pipe.transformQuery('desc', 'sort');
                expect(result).toBe('desc');
            });

            it('should throw BadRequestException when sort value is invalid', async () => {
                await expect(async () => {
                    // @ts-ignore - 私有方法测试
                    await pipe.transformQuery('invalid', 'sort');
                }).rejects.toThrow(new BadRequestException('排序只能是 asc 或 desc'));
            });
        });

        // 测试其他参数
        describe('when queryName is neither "page" nor "sort"', () => {
            it('should return original value', async () => {
                const testValue = 'test';
                // @ts-ignore - 私有方法测试
                const result = await pipe.transformQuery(testValue, 'other');
                expect(result).toBe(testValue);
            });
        });
    });
});
