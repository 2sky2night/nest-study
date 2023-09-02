// src/filter/http-execption.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExecptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    // 获取响应response
    const response = ctx.getResponse<Response>();
    // 获取请求request
    const request = ctx.getRequest<Request>()
    // 获取状态码
    const status = exception.getStatus();
    // 获取异常的消息
    const message = exception.message;

    response.status(status).json({
      code: status,
      msg: message,
      path: request.path,
      method: request.method,
      timestamp: Date.now()
    });
  }
}