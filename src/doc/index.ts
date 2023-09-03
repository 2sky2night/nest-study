import { NestApplication } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const SwaggerDOC = (app: NestApplication) => {
  /* 启动swagger */
  const options = new DocumentBuilder()
    .addBearerAuth() // 开启 BearerAuth 授权认证
    .setTitle('API 文档') // 项目名称
    .setDescription('API 文档') // 项目描述
    .setTermsOfService('https://docs.nestjs.cn/8/introduction')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // 文档路径
  SwaggerModule.setup('/doc/swagger-api', app, document);
}