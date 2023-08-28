// 创建http服务器的工厂函数
import { NestFactory } from '@nestjs/core';
// 根应用
import { AppModule } from './app.module';

async function bootstrap () {
  // 使用根应用来创建http服务
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
