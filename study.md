Nest.js
https://juejin.cn/post/7032079740982788132
https://docs.nestjs.cn/10/controllers

https://juejin.cn/post/7002176233115123725nest.js

集成sequlize:https://docs.nestjs.cn/10/techniques?id=sequelize-%e9%9b%86%e6%88%90

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

下面来介绍一些简单使用方式

## 入口文件

```ts
// 创建http服务器的工厂函数
import { NestFactory } from '@nestjs/core';
// 根模块
import { AppModule } from './app.module';

async function bootstrap () {
  // 使用根模块来创建http服务
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

```

## 根模块

在Nest中使用@Module来装饰一个模块，模块可以用来注册控制层、服务层、其他模块等。

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './modules/student/student.module';
// 根模块，注册所有模块
@Module({
  // 路由模块通过imports中注册
  imports: [StudentModule],
  // 控制层在这里注册
  controllers: [AppController],
  // service层在这里注册
  providers: [AppService],
})
export class AppModule {}
```

## student路由模块编写

在src中创建modules文件夹，再创建对应模块的文件夹student，在里面分别配置controller、service、模块导出文件。

### 控制层

```ts
import { Controller,Get } from "@nestjs/common";
import { StudentService } from "./student.service";

@Controller('student')
export class StudentController{
  constructor(private readonly studentServiceImp:StudentService){}
  @Get('list')
  getStudentList() {
    return this.studentServiceImp.getStudentList()
  }
}
```

### 服务层

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class StudentService{
  getStudentList() {
    return [
      {
        name: '张三',
        age: 18
      },
      {
        name: '李四',
        age: 20
      }
    ]
  }
}
```

### 模块

```ts
import { Module } from "@nestjs/common";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";

/**
 * 学生根模块
 */
@Module({
  providers:[StudentService],
  controllers:[StudentController]
})
export class StudentModule{}
```

## HTTP请求路径前缀

```ts
// 创建http服务器的工厂函数
import { NestFactory } from '@nestjs/core';
// 根应用
import { AppModule } from './app.module';
async function bootstrap () {
  // 使用根应用来创建http服务
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api')
  await app.listen(3000);
}
bootstrap();

```



# 一、控制层

  Nest.js的控制层都是整合了路由的，所以一个控制层可以代表一个路由模块，再通过模块注册路由到应用中去。

  ## 1.Controller装饰器

​	controller类装饰器用来告诉Nest应用，在处理某个http请求时下发到对应的控制层。**controller注释器的作用其实就是用来配置模块的根路由**

​	可以传一个参数，这个参数就是该控制层的路由根路径，配置了根路径后，该控制层中所有的路由路径在请求时路径前缀都需要加上路由根路径。

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
}

```

## 2.HTTP请求注释器

HTTP请求注释器是用来配置路由的，例如`@Get('user')` ，是代表请求方式为get、请求路径/user，执行对应的处理函数，处理函数就是请求注释器修饰的方法。

  ```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
 // @Get请求不配置路径时，则请求路径和根路径一致
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}

  ```

```ts
import { Controller,Get } from "@nestjs/common";
import { StudentService } from "./student.service";

@Controller('student')
export class StudentController{
  constructor(private readonly studentServiceImp:StudentService){}
  @Get('list') // 映射 /student/list get请求 执行getStudentList处理函数
  getStudentList() {
    return this.studentServiceImp.getStudentList()
  }
}
```



## 3.控制器方法中的参数装饰器

Nest提供了如下的参数装饰器，来处理中间件和获取请求上下文的信息。

在路由的处理函数中，第一个为req，第二个为res,第三个参数为next，要想要获取这些参数，需要使用装饰器来获取到req或res，使用了res装饰器，必须调用res.send结束响应

 第一个参数只能使用req相关的装饰器，如@Req，@Body，@query等

第二个参数装饰器固定为Res

第三个参数装饰器固定为Nest

|                           |                                   |
| :------------------------ | :-------------------------------- |
| `@Request()，@Req()`      | `req`                             |
| `@Response()，@Res()*`    | `res`                             |
| `@Next()`                 | `next`                            |
| `@Session()`              | `req.session`                     |
| `@Param(key?: string)`    | `req.params`/`req.params[key]`    |
| `@Body(key?: string)`     | `req.body`/`req.body[key]`        |
| `@Query(key?: string)`    | `req.query`/`req.query[key]`      |
| `@Headers(name?: string)` | `req.headers`/`req.headers[name]` |
| `@Ip()`                   | `req.ip`                          |
| `@HostParam()`            | `req.hosts`                       |



### 查询参数

当然，使用Req参数装饰器也可以通过req.query访问到查询参数。

```ts
  @Get('/query')
  testQuery(@Query() query: any) {
    return query
  }
```

### 请求体

当然，使用Req参数装饰器也可以通过req.body来访问到请求体中的内容。最好对请求体进行类型注释，通过DTO的方式声明类型。

```ts
  @Post('/post')
  testPost(@Body() body: any) {
    return  body
  }
  @Post('add')
  createStudent(@Body() student: CreateStudentDto) {
    return student
  }
// student.dto.ts
export class CreateStudentDto {
  readonly age: number;
  readonly name: string;
}
```

## 4.HTTP状态码装饰器

通过HTTPCode可以快速的定义接口响应的HTTP状态码。

```ts
  @Post('/post')
  @HttpCode(200)
  testPost(@Body() body: any) {
    return  body
  }
```

## 5.Headers装饰器

Header装饰器可以快速的给响应头部注入内容

```ts
  @Post('/post')
  @Header('app-type','Nest.js')
  testPost(@Body() body: any) {
    return  body
  }
```

## 6.路由参数(动态路径)

​	通过配置路径参数，就可以达成不同路径执行相同处理函数的功能。

```ts
  @Get(':id/:name') // pathname:/1/mark
  getOne(@Param() params:any) {
    // 路由参数，动态的参数，执行同一个处理函数
    return params
  }
```

## 7.响应处理和拦截器

### 拦截器

​	拦截器：https://juejin.cn/post/6844903939196846087、https://wdk-docs.github.io/nest-docs/interceptors/ 、https://juejin.cn/post/7220070434188214332#heading-3、https://juejin.cn/post/7217795158367682597

​	做响应处理和异常响应处理，都需要使用Nest的拦截器功能，拦截器是什么？拦截器就是客户端请求到服务端时会拦截（请求拦截器），服务端向客户端响应内容时会拦截（响应拦截器），其主要功能有

- 在方法执行之前或之后执行**额外的逻辑**，这些逻辑一般不属于业务的一部分
- **转换**函数执行结果
- **转换**函数执行时抛出的异常
- 扩展函数基本行为
- 特定场景下完全重写函数的行为（比如缓存拦截器，一旦有可用的缓存则直接返回，不执行真正的业务逻辑，即业务逻辑处理函数行为已经被重写）

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/10/16d1a05f7b48726f~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp">

#### 拦截器接口

​	每个拦截器都需要实现**NestInterceptor**接口的**intercept()**方法，该方法接收两个参数。方法原型如下：

```ts
function intercept(context: ExecutionContext, next: CallHandler): Observable<any>
```

ExecutionContext 执行上下文，与[NestJs学习之旅(7)——路由守卫](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ddhigh.com%2F2019%2F08%2F27%2Fnestjs-guard.html)中的**执行上下文**相同

CallHandler 路由处理函数，其中的handle方法调用后可以获得路由处理函数的返回结果。

#### 拦截器作用域

拦截器可以在以下作用域进行绑定：全局拦截器 ,路由(控制层独享)拦截器, 路由方法（方法独享）拦截器

##### 全局拦截器

在main.ts中使用以下代码即可：

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new AppInterceptor());
```

##### 控制器拦截器

将对该控制器所有**路由**方法生效：

```less
@Controller('user')
@UseInterceptors(AppInterceptor)
export class UserController {
}
```

##### 路由方法拦截器

只对当前被装饰的路由方法进行拦截：

```less
@Controller('user')
export class UserController {
  @UseInterceptors(AppInterceptor)
  @Get()
  list() {
    return [];
  }
}
```

#### 请求日志拦截器

```ts
// app.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { format } from 'util';

@Injectable()
export class AppLogger implements NestInterceptor {
  private readonly logger = new Logger(); // 实例化日志记录器

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now(); // 请求开始时间

    return next.handle().pipe(tap((response) => {
      // 调用完handle()后得到RxJs响应对象，使用tap可以得到路由函数的返回值
      const host = context.switchToHttp();
      const request = host.getRequest<Request>();

      // 打印请求方法，请求链接，处理时间和响应数据
      this.logger.log(format(
        '%s %s %dms %s',
        request.method,
        request.url,
        Date.now() - start,
        JSON.stringify(response),
      ));
    }));
  }
}

```

##### 注册拦截器

```ts
app.useGlobalInterceptors(new AppLogger())
```

#### 统一的响应处理

​	通过拦截器可以实现对响应的错误和成功处理的内容进行处理。统一响应一种风格的response。

​	使用了NestInterceptor，Response类需要实现NestInterceptor，代码中的 `ResponseInterceptor` 是一个用于统一响应结果的响应拦截器，通过 `map()` 运算符改变响应结果格式，并在结果中添加固定的格式。

```ts
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

interface data<T> {
  data: T
}

@Injectable()
export class Response<T = any> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<data<T>> {
    return next.handle().pipe(map((data) => {
      return {
        data,
        code: 200,
        message: "ok"
      }
    }))
  }
}
```

或

```ts
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 响应拦截器
@Injectable()
export class Response implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next.handle().pipe(map(data => {
      return {
        data,
        code: 200,
        msg:'ok'
      }
    }))
  }
}

```



##### 注册拦截器

```ts
// 创建http服务器的工厂函数
import { NestFactory } from '@nestjs/core';
// 根应用
import { AppModule } from './app.module';
// 拦截器
import { Response } from './interceptor';
async function bootstrap () {
  // 使用根应用来创建http服务
  const app = await NestFactory.create(AppModule);
  // 注册全局拦截器
  app.useGlobalInterceptors(new Response())
  await app.listen(3000);
}
bootstrap();

```



### 异常处理(推荐用过滤器)

#### 业务异常

##### 使用过滤器

https://docs.nestjs.cn/8/exceptionfilters

@Catch()
不指定Exception将会捕捉所有错误

```ts
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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      code: status,
      message,
    });
  }
}
```
或这种格式的
```ts
/* all-exception.filter.ts */

// 引入所需内置对象
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import * as moment from 'moment';

// 们需要访问底层平台 `Request`和 `Response`
import { Request, Response } from 'express';

// 它负责捕获作为`HttpException`类实例
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); //可以获取上下文
    const response = ctx.getResponse<Response>(); // 获取相应结果
    const request = ctx.getRequest<Request>(); // 获取req
    const status = exception.getStatus(); // 获取失败的状态码
    // 用于接收主动发错的错误信息 
    const { message, code } = exception.getResponse() as any;
    response.status(status).json({
      code: code || status,
      timestamp: moment().format('yyyy-MM-DD HH:mm:ss'),
      path: request.url,
      error: 'Bad Request',
      message,
    });
  }
}


```

###### 在业务失败时执行错误，让过滤器捕获

```ts
  @Post('add')
  async createStudent(@Body() student: CreateStudentDto) {
    // NotFoundException为nest内置的错误，会被过滤器捕获
    throw new NotFoundException('未找到学生!');
    return student
  }
```

###### 注册过滤器

```ts
  // 注册全局过滤器
  app.useGlobalFilters(new HttpExecptionFilter())
```

#### 内部错误

##### 使用拦截器拦截内部错误

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => throwError(new BadGatewayException())) // catchError用来捕获异常
      );
  }
}

```

##### 使用过滤器处理内部错误

```ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class InternalErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: 'Internal Server Error',
    });
  }
}
```



## 8.文件

​	文件流相关node知识前置：https://juejin.cn/post/6844903633788600333

### 	文件上传

​	nest的文件上传使用的是Multer，专门用来处理form-data类型的文件上传。文件上传失败会被全局的过滤器拦截`Catch（HttpException）`，也可以拦截。

#### 装饰器接收的参数

​	FileInterceptor接收两个参数，一是解析form-data中的哪个字段，第二个是配置项，可以配置文件保存到哪儿，上传数据的限制等等。若不配置dest或storage，文件会保存在内存中。

| Key                 | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `dest` or `storage` | Where to store the files                                  |
| `fileFilter`        | Function to control which files are accepted              |
| `limits`            | Limits of the uploaded data                               |
| `preservePath`      | Keep the full path of files instead of just the base name |

#### 单一文件（单字段）

​	FileInterceptor用来解析form-data中的某个字段，UploadedFile参数装饰器是用来解析文件，注入到控制层处理函数中。

```ts
@Controller('file')
export class FileController {
  @Post('upload')
  // 使用拦截器来解析请求体
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file:FileDTO) {
    return 'ok'
  }
}
```

##### 保存文件

```ts
import { Controller, UploadedFiles, UploadedFile,UseInterceptors } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { FileDTO } from "./dto/file-dto";
import {createWriteStream,writeFileSync} from 'fs'
import {resolve} from 'path'

@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file:FileDTO) {
    const rootPath = resolve('./src/static/file')
    // 直接保存
    writeFileSync(resolve(rootPath, `./${file.originalname}`),file.buffer)
    // 通过流式保存文件
    // const fileStream = createWriteStream(resolve(rootPath, `./${file.originalname}`))
    // await new Promise<void>(r => {
    //   fileStream.write(file.buffer, () => {
    //     // 文件流保存成功的回调
    //     r()
    //   })
    // })
    return 'ok'
  }
}
```

##### 一个字段保存多个文件

​	FilesInterceptor用来解析一个字段有多个文件的。

```ts
  @Post('/uploads')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: FileDTO[]) {
    console.log(files);
    
    return 'ok'
  }
```

#### 多文件上传(多字段多文件)

```ts
  // 多个文件
  @Post('/uploadFields')
  @UseInterceptors(FileFieldsInterceptor([
  // name为字段铭，maxCount：字段值的数量
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 },
  ]))
  uploadFields(@UploadedFiles() files: { avatar: FileDTO, background :FileDTO}) {
    console.log(files);
    return 'ok'
  }
```

#### 文件上传统一配置

​	在上述中案例中，若我们需要对每个文件上传接口配置上传路径、上传大小限制等进行约束就需要给每个路由都需要配置，很麻烦，所以使用统一的文件上传配置方便维护。

```ts
import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [MulterModule.register({
    limits: {
      // 限制文件大小为1mb
      files:1024*1024
    }
  })],
  controllers:[FileController]
})
export class FileModule {}
```

### 文件下载

#### 浏览器下载

推荐使用流式读取文件，占用内存少，writeFile是直接打开整个文件，占用资源多。

```ts
  // 文件下载(直接下载)
  @Get('/download')
  async downloadFile(@Res() res: Response) {
    const rootPath = resolve('./src/static/file')
    // filename为下载时的文件名称
    res.setHeader('Content-Disposition', "attachment;filename=" + '1.png')
    //第二个参数配置项 highWaterMark 最高水位线,默认最多读取64K,这里设置每次读取1b
    const fileStream = createReadStream(resolve(rootPath, './1.png'), { highWaterMark: 1 })
    const buffer = await new Promise<Buffer>(r => {
      // 保存buffer流片段
      const arrBuffer: Buffer[] = []
      fileStream.on('data', (chunk: Buffer) => {
        // 以流的方式读取文件，每次读取保存一段数据
        arrBuffer.push(chunk)
      })
      fileStream.on('end', () => {
        // 文件读取完成，合并数据
        r(Buffer.concat(arrBuffer))
      })

    })
    return res.send(buffer)
  }
```



## 9.中间件

​	在nest应用中，中间件就是在调用路由处理函数之前需要做的事情，比如解析请求体、解析token。。。中间件可以通过上下文访问req、res。中间件可以在处理函数之前做一些其他事情、结束响应、调用下一个中间件、解析请求数据。

### 定义中间件

```ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: (error?: any) => void) {
    console.log(req.path);
    // 执行下一个中间件
    next()
  }
}
```

### 注册中间件

### 注册一个中间件

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './modules/student/student.module';
import { LogMiddleware } from './middleware';
// 根模块，注册所有模块
@Module({
  // 路由模块通过imports中注册
  imports: [StudentModule],
  // 控制层在这里注册
  controllers: [AppController],
  // service层在这里注册
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 只有student模块的路由才会触发中间件
    consumer.apply(LogMiddleware).forRoutes('student')
  }
}

```

### 注册多个中间件

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './modules/student/student.module';
import { LogMiddleware, TestMiddleware } from './middleware';
// 根模块，注册所有模块
@Module({
  // 路由模块通过imports中注册
  imports: [StudentModule],
  // 控制层在这里注册
  controllers: [AppController],
  // service层在这里注册
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 只有student模块的路由才会触发中间件
    consumer.apply(LogMiddleware,TestMiddleware).forRoutes('/student')
  }
}

```

### 注册中间件到指定路由控制层

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './modules/student/student.module';
import { LogMiddleware, TestMiddleware } from './middleware';
import { StudentController } from './modules/student/student.controller';
// 根模块，注册所有模块
@Module({
  // 路由模块通过imports中注册
  imports: [StudentModule],
  // 控制层在这里注册
  controllers: [AppController],
  // service层在这里注册
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 只有student模块的路由才会触发中间件
    consumer.apply(LogMiddleware,TestMiddleware).forRoutes(StudentController)
  }
}

```

### 指定中间件应用到哪些处理函数中

```ts
// ...、
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      Comment,
      UserEntity,
      FollowsEntity,
    ]),
    UserModule,
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "articles/feed", method: RequestMethod.GET },
        { path: "articles", method: RequestMethod.POST },
        { path: "articles/:slug", method: RequestMethod.DELETE },
        { path: "articles/:slug", method: RequestMethod.PUT },
        { path: "articles/:slug/comments", method: RequestMethod.POST },
        { path: "articles/:slug/comments/:id", method: RequestMethod.DELETE },
        { path: "articles/:slug/favorite", method: RequestMethod.POST },
        { path: "articles/:slug/favorite", method: RequestMethod.DELETE }
      );
  }
}

```



### 函数式中间件

```ts
import { Injectable, NestMiddleware } from "@nestjs/common";

export function TestMiddleware(req: any, res: any, next: () => void) {
  console.log('ok');
  next()
}
```

### 全局中间件

```ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

## 10.守卫

​	守卫和前端路由守卫一样，可以拦截一些非法请求接口，例如未登录不能请求该接口...

https://www.ddhigh.com/2019/08/27/nestjs-guard.html