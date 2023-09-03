// src/filter/http-execption.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExecptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    // 获取响应response
    const response = ctx.getResponse<Response>();
    // 获取请求request
    const request = ctx.getRequest<Request>()

    response.status(500).json({
      code: 500,
      msg: '服务器内部错误!',
      path: request.path,
      method: request.method,
      timestamp: Date.now()
    });
  }
}