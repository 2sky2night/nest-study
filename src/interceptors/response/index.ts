import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 响应拦截器
@Injectable()
export class Response implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next.handle().pipe(map((data:any) => {
      return {
        data,
        code: 200,
        msg:'ok'
      }
    }))
  }
}


