import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface Response<T> {
    statusCode?: number | undefined;
    message: string;
    data: T | null;
    type: "SUCCESS" | "ERROR" |"WARNING" | "WAIT";
    timestamp: string;
  }
  
  @Injectable()
  export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Response<T>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        return next
        .handle()
        .pipe(map((data: Response<T>) => {
            response.status(data?.statusCode ?? 200);
            const res: Response<T> = {
                // statusCode: data.statusCode ?? 200,
                message: data?.message ?? "OK",
                data: data?.data ?? null,
                type: data?.type ?? "SUCCESS",
                timestamp: data?.timestamp ?? new Date().toISOString(),
            }
           return res;
        }),
      );
    }
  }