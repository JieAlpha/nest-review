import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { map, tap, catchError, timeout } from 'rxjs/operators';

// 响应数据接口
interface Response<T> {
    data: T;
    timestamp: number;
    path: string;
    status: number;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const now = Date.now();

        console.log(`⬇️ ${method} ${url} - ${new Date(now).toLocaleString()}`);

        return next.handle().pipe(
            tap((data) => {
                const responseTime = Date.now() - now;
                console.log(`⬆️ ${method} ${url} - ${responseTime}ms`);
                console.log('Response:', data);
            }),
        );
    }
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            map(data => ({
                data,
                timestamp: Date.now(),
                path: request.url,
                status: HttpStatus.OK
            }))
        );
    }
}

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(error => {
                if (error instanceof HttpException) {
                    return throwError(() => error);
                }
                return throwError(() => new HttpException(
                    '发生了意外错误',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                ));
            }),
        );
    }
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(5000),
            catchError(err => {
                if (err instanceof TimeoutError) {
                    return throwError(() => new RequestTimeoutException());
                }
                return throwError(() => err);
            }),
        );
    }
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    private cache = new Map<string, { data: any; timestamp: number }>();
    private readonly TTL = 60 * 1000; // 1分钟缓存

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const cacheKey = request.url;
        const cached = this.cache.get(cacheKey);
        const now = Date.now();

        // 如果有缓存且未过期，直接返回缓存数据
        if (cached && now - cached.timestamp < this.TTL) {
            console.log(`🎯 Cache hit: ${cacheKey}`);
            return new Observable(subscriber => {
                subscriber.next(cached.data);
                subscriber.complete();
            });
        }

        // 无缓存或已过期，执行原始请求并缓存结果
        return next.handle().pipe(
            tap(data => {
                console.log(`💾 Cache miss: ${cacheKey}`);
                this.cache.set(cacheKey, {
                    data,
                    timestamp: now,
                });
            }),
        );
    }
}

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                if (Array.isArray(data)) {
                    return data.filter(item => item !== null);
                }
                return data;
            }),
        );
    }
}
