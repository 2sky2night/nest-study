// 创建http服务器的工厂函数
import { NestFactory } from '@nestjs/core';
// 根应用
import { AppModule } from './app.module';
// 拦截器
import { Response, AppLogger, ErrorsInterceptor } from './interceptors';
// 过滤器
import {HttpExecptionFilter} from './filters'
async function bootstrap () {
  // 使用根应用来创建http服务
  const app = await NestFactory.create(AppModule);
  // 注册全局过滤器
  app.useGlobalFilters(new HttpExecptionFilter())
  // 注册全局拦截器
  app.useGlobalInterceptors(new Response())
  app.useGlobalInterceptors(new AppLogger())
  // app.useGlobalInterceptors(new ErrorsInterceptor())
  app.setGlobalPrefix('/api')
  await app.listen(3000);
}
bootstrap();
