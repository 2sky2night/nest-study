Nest.js
https://juejin.cn/post/7032079740982788132
https://docs.nestjs.cn/10/controllers
# 零、环境搭建
  全局安装Nest.js脚手架，也可以手动搭建，需要手动搭建Next应用的全部组件。
  ```shell
  npm i -g @nestjs/cli
  nest new project-name //js
  nest new --strict project-name
  ```
  搭建好后的目录如下
  src
    ├── app.controller.spec.ts  对于基本控制器的单元测试样例
    ├── app.controller.ts  带有单个路由的基本控制器示例。
    ├── app.module.ts 应用程序的根模块
    ├── app.service.ts 带有单个方法的基本服务
    └── main.ts 入口文件
  ```shell
  pnpm run start:dev 来启动应用
  ```

# 控制层
  Nest.js的控制层都是整合了路由的，所以一个控制层可以代表一个路由模块，再通过根模块注册路由到应用中去。
  
  ## Controller装饰器

  ```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}

  ```