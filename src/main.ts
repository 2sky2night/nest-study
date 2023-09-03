// 创建http服务器的工厂函数
import { NestApplication, NestFactory } from '@nestjs/core';
// 根应用
import { AppModule } from './app.module';
// 拦截器
import { Response, AppLogger, ErrorsInterceptor } from './interceptors';
// 过滤器
import { HttpExecptionFilter } from './filters'
import { SwaggerDOC } from './doc';
import { ExecptionFilter } from './filters/execption-filter';
// 集成swagger
async function bootstrap() {
  // 使用根应用来创建http服务
  const app = await NestFactory.create(AppModule);
  // 注册全局过滤器
  // 全局内部错误
  app.useGlobalFilters(new ExecptionFilter())
  // 全局业务错误
  app.useGlobalFilters(new HttpExecptionFilter())
  // app.useGlobalInterceptors(new ErrorsInterceptor())
  // 注册全局拦截器
  app.useGlobalInterceptors(new Response())
  app.useGlobalInterceptors(new AppLogger())
  app.setGlobalPrefix('/api')
  SwaggerDOC(app as NestApplication)
  await app.listen(3000);
}
bootstrap();
