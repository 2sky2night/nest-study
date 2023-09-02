Nest.js
https://juejin.cn/post/7032079740982788132
https://docs.nestjs.cn/10/controllers

https://juejin.cn/post/7002176233115123725nest.js

集成sequlize:

https://docs.nestjs.cn/10/techniques?id=sequelize-%e9%9b%86%e6%88%90

https://nestjs.bootcss.com/recipes/sql-sequelize

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

## 文件结构

nodejs
├── package.json
├── README.md
├── src
│   │   └── constants（全局常量定义）
│   │       ├──common.constants.ts
│   │   └── utils（常用工具类）
│   │       ├──http.util.ts
│   │       └──file.util.ts
│   ├── app.module.ts（模块配置文件）
│   ├── common （通用模块，包含自定义装饰器、过滤器、守卫、拦截器、中间件）
│   │   ├── decorators （项目通用装饰器）
│   │   │   └── roles.decorator.ts
│   │   ├── filters （过滤器）
│   │   │   └── http-exception.filter.ts
│   │   ├── guards （守卫）
│   │   │   └── roles.guard.ts
│   │   ├── interceptors （拦截器）
│   │   │   ├── exception.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   ├── middleware （中间件）
│   │   │   └── logger.middleware.ts
│   │   └── pipes （管道，主要用于数据验证和类型转换）
│   │       ├── parse-int.pipe.ts
│   │       └── validation.pipe.ts
│   ├── config （配置文件信息）
│   │   ├── database.ts
│   │   ├── redis.ts
│   ├── jobs （高并发场景下队列处理）
│   ├── main.ts （入口文件）
│   ├── modules （业务代码，按目录区分模块）
│   │   ├── hello
│   │   │   ├── hello.controller.ts
│   │   │   ├── hello.module.ts
│   │   │   └── hello.service.ts
│   │   └── users
│   │   │   ├── dto （数据传输对象定义）
│   │   │   │   └── users.create.dto.ts
│   │   │   │   └── users.update.dto.ts
│   │       ├── users.controller.ts （控制层）
│   │       ├── users.entity.ts （映射数据库模型对象）
│   │       ├── users.module.ts (模块定义）
│   │       └── users.service.ts （service层）
│   ├── tasks （定时任务）
│   │   ├── tasks.module.ts
│   │   └── tasks.service.ts
│   └── templates （页面模板）
├── test （单元测试）
│   ├── app.e2e-spec.ts
├── tsconfig.json

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

## 7.响应处理之拦截器与过滤器

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

或
// src/filter/http-execption.filter.ts

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
      timestamp:Date.now()
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

## 10.守卫（路由鉴权）

​	守卫和前端路由守卫一样，可以拦截一些非法请求接口，例如未登录不能请求该接口...，其基本作用就是在执行路由处理函数之前需要做的事情，其实我感觉就是把中间件细分出来守卫的概念，比如说还有拦截器也是同理，在执行前需要做的操作。

​	守卫的执行时机：**守卫在每个中间件之后执行（意味着可以在中间件中解析token保存在上下文中，守卫可以对请求的用户进行鉴权）**，但在任何拦截器或管道之前执行。

https://www.ddhigh.com/2019/08/27/nestjs-guard.html

....



## 11.管道（解析和校验参数）

​	管道是作用在控制层中用来校验输入数据的类型或对输入数据进行类型转换。可以对路由处理函数的参数（查询参数、路径参数、请求体数据）进行验证。验证成功执行处理函数，验证失败响应错误信息。

`Nest` 自带九个开箱即用的管道，即

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`

若不使用管道我们可能就需要使用中间件或在处理函数内部进行校验，如：

```ts
  @Get('find')
  async findUser(@Query() query: UserFindDto) {
    if (query.id === undefined) {
      throw new BadRequestException('未携带参数!')
    }
    if (isNaN(+query.id)) {
      throw new BadRequestException('参数非法!')
    }
    return await this.userService.findUser(+query.id)
  }
```

使用管道优化参数校验：

@Query装饰器不仅可以获取req.query，还可以单独解析出某个属性，第一个参数就是指定要解析的参数，第二个是校验管道，解析成整数，解析成功就执行处理函数，解析失败就返回错误信息，阻止执行处理函数。

```ts
  @Get('find')
  // 使用管道来解析参数，解析成功执行处理函数，解析失败响应错误信息
  async findUser(@Query('id', ParseIntPipe) id: number) {
    return await this.userService.findUser(id)
  }
  @Delete('remove/:id')
  // 使用管道来解析路径参数，解析成功执行处理函数，解析失败响应错误信息
  async removeUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.removeUser(id)
  }
```

### 1.校验对象类型的数据

​	上述是简单的单一数据校验，对于一般的Post请求都需要校验整个DTO。我们采用类校验器来校验处理函数中的DTO。

#### 安装依赖

```shell
$ npm i --save class-validator class-transformer
```

#### 编写管道

​	其实用Nest内置ValidationPipe管道一样可以完成校验请求体表单，不过不能自定义错误信息了。

```ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
     // 如果没有传入验证规则，则不验证，直接返回数据
      return value;
    }
    // object为传入的表单值（请求体或装饰的目标参数）
    const object = plainToInstance(metatype, value);
    // 通过值去校验表单
    const errors = await validate(object);

    // 出现错误了
    if (errors.length > 0) {
      if (errors[0].constraints) {
        // 获取校验失败的原因
        const tips = Object.values(errors[0].constraints)[0]
        throw new BadRequestException(`表单校验失败:${tips}`);
      } else {
        throw new BadRequestException('表单校验失败!')
      }
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

```

#### 编写处理函数的DTO

```ts
import { Max, Min, IsString, IsNotEmpty, Length } from 'class-validator'
// Max、Min 是数字大小相关,不是字符串长度！

export class UserCreateDto {
  @IsString({ message: '用户名为一个字符串!' })
  @IsNotEmpty({ message: '用户名不能为空!' })
  @Length(1, 10, { message: '用户名字段长度为1-10!' })
  readonly username: string;
  
  @IsString({ message: '密码为一个字符串!' })
  @IsNotEmpty({ message: '密码不能为空!' })
  @Length(6, 14, { message: '密码字段长度为6-14!' })
  readonly password: string;
}
```

#### 使用管道，通过DTO来校验表单

```ts
  @Post('add')
  // 通过管道+DTO来校验请求体数据
  async createUser(@Body(new ValidationPipe()) body: UserCreateDto): Promise<any> {
    return await this.userService.createUser(body)
  }
```



### 2.自定义管道

​	上述例子就是通过**自定义管道实现校验请求体参数**。不过在有的时候我们也想去校验query参数或params参数，但Nest内置的管道不符合需求，就需要自己定义一个管道了。**transform可以是一个异步的函数，意味着我们甚至可以在这里去操作DB，例如删除用户前，查询用户是否存在**

#### 定义管道

```ts
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";


export class PagePipe implements PipeTransform<string, number> {
  // PipeTransform接收两个泛型，第一个是管道入参类型，第二个是管道解析后返回的类型
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata);
    // value 是绑定的参数传入的数据
    // metadata 包含了该参数被装饰时的信息例如，装饰的是请求体？查询参数，路径参数等，data为装饰的形参名称
    const page = Number(value)
    if (isNaN(page)) {
      throw new BadRequestException('页码非法!')
    }
    if (page < 1) {
      throw new BadRequestException('页码必须大于等于1')
    }
    return page
  }
}
```

#### 使用

```ts
  @Get('pipe')
  testPipe(@Query('page',new PagePipe()) page:number) {
    return page
  }
```

## 12.过滤器（捕获错误）



## 13.拦截器（统一响应内容）

# 二、服务层

## 1.一个基础的service

​	服务层负责执行接口的真正业务逻辑，并将结果返回给控制层，其核心就是操作数据库。

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

**注入给控制层**

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

还需要给控制层挂载服务层，作为实例的属性。

```ts
import { Body, Controller, Get, Ip, Query, Res, NotFoundException, Post, HttpCode, Headers, Header, Param } from "@nestjs/common";
import { StudentService } from "./student.service";
import { NextFunction, Response, query } from "express";
import { CreateStudentDto } from "./student.dto";

@Controller('student')
export class StudentController {
    // 将服务层实例化
  constructor(private readonly studentServiceImp: StudentService) { }
}

```

# 三、数据库

​	主要介绍Nest.js集成sequlize，数据库驱动为mysql2。

## 1.集成nest-sequlize

​	nest内置有集成seqluze的，所以用这种更方便。

### 1.搭建连接数据库环境

1.1需要先项目中安装依赖:

```shell
$ npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
$ npm install --save-dev @types/sequelize
```

2.在app.module.ts中，在模块中导入数据库驱动，注册为模块，将sequlize注入到所有模块中。

```ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      // 选择连接的数据库驱动
      dialect: 'mysql',
      // 主机
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      // 选择连接的数据库
      database: 'test',
      // 
      models: [],
    }),
  ],
})
export class AppModule {}

```

3.这样所有的模型层都可以通过this访问sequlize对象了。

```typescript
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {}
}
```

### 2.sequlize-typescript快速入门

https://github.com/Haochen2499/sequelize-typescript-doc-zh

https://github.com/sequelize/sequelize-typescript#column

​	由于之前学习的是sequlize，在sequelize-typescript中大部分模型字段声明、关系声明都是用的装饰器。

### 3.简单实例

#### 3.1创建一个模型

```ts
import { Column, Comment, Model, Table, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

/**
 * 用户模型
 */
@Table
export class User extends Model<User> {
  // colunm装饰器必须在最下面，否则一直报错
  @PrimaryKey
  @AutoIncrement
  @Comment('用户id')
  @Column(DataType.INTEGER)
  user_id: number;

  @Comment('用户名称')
  @Column
  username: string;
  
  @Comment('用户密码')
  @Column
  password: string;
}

```

#### 3.2注册模型

​	让Sequlize知道需要控制该表，若数据库下不存在该表，会创建该表，然后还需要在对应模块中注入该模型才能使用。

```ts
import { SequelizeModule } from '@nestjs/sequelize';
// 用户模型
import { User } from './modules/user/user.model';
// 根模块，注册所有模块
@Module({
  // 路由模块通过imports中注册
  imports: [
    StudentModule,
    FileModule,
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'nest-study',
      models: [
        User
      ]
    })
  ],
//....
})
export class AppModule {}

```

同时，哪个模块需要使用到该模型就需要通过模块中注入该模型，这样服务层才能通过注入的模型操作数据库

```ts
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user.model";

@Module({
  // 将用户模型注入到user模块中
  imports:[SequelizeModule.forFeature([User])],
  providers:[],
  controllers:[]
})
export class UserModle {}
```

最后，在服务层中实例化该模型，就能愉快的DB操作啦~

```ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";

@Injectable()
export class UserService {
  // 注入模型,服务层的各个方法都能访问该模型了
  constructor(
    @InjectModel(User) private userModel:typeof User
  ) { }
  
}
```



## 2.使用Provider手动驱动数据库

​	不使用nest-sequlize，我们可以通过原生sequlize+Nest的依赖注入方式来操作DB

### 2.1 数据库连接准备

#### 创建提供者

​	创建提供者，每个提供者都需要实现**useFactory**方法和provide属性（作为id）

```ts
// database.provider.ts
import { Provider } from "@nestjs/common"
import { Sequelize } from "sequelize-typescript"
import { User } from "src/modules/user/user.model"

export const databaseProviders:Provider[] = [
  {
    provide: 'SEQUELIZE',
    async useFactory() {
      // 建立连接
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'nest-study',
        
      })
      // 添加模型
      sequelize.addModels([
        User
      ])
      // 创建表
      await sequelize.sync({
        alter:true 
      })
      return sequelize
    }
  }
]
```

#### 创建数据库模块

```ts
// database.module.ts
import { Module } from "@nestjs/common";
import { databaseProviders } from "./database.providers";

@Module({
  providers: [...databaseProviders],
  // 导出数据库提供者，导入该模块时就能使用数据库提供者了。
  exports:[...databaseProviders]
})
export class DatabaseModule { }
```

### 2.2 模块需要做的准备

#### 1.创建模型提供者

​	模型提供者主要是为了能够让模块能够使用该模型，操作DB。

```ts
// user.providers.ts
import { User } from "./user.model";

export const userProviders = [
  {
    provide: 'UserRepository',
    useValue: User
  }
]
```

#### 2.导入数据库模块和模型提供者

​	导入数据库模块主要是为了，建立模型和创建表，**其实数据库模块可以在根模块中导入注册**。

​	**注意**，一定要导入模型提供者，这样提供了依赖，服务层才能被注入模型实例。

```ts
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DatabaseModule } from "src/database/database.module";
import { userProviders } from "./user.providers";

@Module({
  imports: [DatabaseModule],
  providers: [UserService, ...userProviders],
  controllers: [UserController]
})
export class UserModle { }
```

##### 实例化模型

```ts
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";

@Injectable()
export class UserService {
  constructor(
    // 由于userProviders提供了该依赖，所以可以使用Inject将模型注入进来
    @Inject('UserRepository') private readonly userRepository:typeof User
  ){}
  async findAll() {
    return await this.userRepository.findAll()
  }
}
```

## 3.简单案例

### 模型

```ts
import { Column, Comment, Model, Table, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

/**
 * 用户模型
 */
@Table({
  modelName: 'user',
  tableName: 'user'
})
export class User extends Model<User> {
  // colunm装饰器必须在最下面，否则一直报错
  @PrimaryKey
  @AutoIncrement
  @Comment('用户id')
  @Column(DataType.INTEGER)
  user_id: number;

  @Comment('用户名称')
  @Column
  username: string;

  @Comment('用户密码')
  @Column
  password: string;

  @Column
  updatedAt: Date;

  @Column
  createdAt: Date;
}

```

### 服务层

```ts
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { UserCreateDto } from "./dto/user.create.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: typeof User
  ) { }
  async findAll() {
    return await this.userRepository.findAll()
  }
  async createUser(userInfo: UserCreateDto) {
    // 查询用户名是否重复
    const user = await this.findUserByUsername(userInfo.username)
    if (user !== null) {
      // 用户名重复!
      throw new BadRequestException('用户名重复!')
    }
    // 插入用户记录
    const userIns = new User()
    userIns.set('username', userInfo.username)
    userIns.set('password', userInfo.password)
    await userIns.save()
    return '注册成功!'
  }
  async findUserByUsername(username: string) {
    // 通过username查询某个用户名称是否存在
    const user = await this.userRepository.findOne({
      where: {
        username
      }
    })
    return user
  }
  async findUser(user_id: number) {
    const user = await this.userRepository.findByPk(user_id)
    if (user) {
      return user
    } else {
      throw new NotFoundException('此用户id不存在!')
    }
  }
  async removeUser(user_id: number) {
    const user = await this.findUser(user_id)
    await user.destroy()
    return '删除用户成功'
  }
  async updateUser(user_id: number, { username, password }: { username: string, password: string }) {
    const user = await this.findUser(user_id)
    // 直接更新
    user.username=username
    user.password = password
    await user.save()
    return user
  }
}
```

### 控制层

```ts
import { Controller, Get, Post, Body, BadRequestException, Query, Delete, ParseIntPipe, UsePipes, Param, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/user.create.dto";
import { ValidationPipe } from "./pipe/validation.pipe";
import { PagePipe } from "./pipe/pageValidation.pipe";
import { UserUpdateDto } from "./dto/user.update.dto";

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }
  @Get('list')
  async getUserList() {
    return await this.userService.findAll()
  }
  // 增
  @Post('add')
  // 通过管道+DTO来校验请求体数据
  async createUser(@Body(new ValidationPipe()) body: UserCreateDto): Promise<any> {
    return await this.userService.createUser(body)
  }
  // 查
  @Get('find')
  // 使用管道来解析参数，解析成功执行处理函数，解析失败响应错误信息
  async findUser(@Query('id', ParseIntPipe) id: number, @Query('name') name: string) {
    return await this.userService.findUser(id)
  }
  // 删
  @Delete('remove/:id')
  // 使用管道来解析路径参数，解析成功执行处理函数，解析失败响应错误信息
  async removeUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.removeUser(id)
  }
  // 更新
  @Put('update/:id')
  async updateUser(@Param('id', ParseIntPipe) user_id: number, @Body(new ValidationPipe()) userUpdateDto: UserUpdateDto) {
    return await this.userService.updateUser(user_id, userUpdateDto)
  }
  @Get('pipe')
  testPipe(@Query('page', new PagePipe()) page: number) {
    return page
  }
}
```

### 提供者

提供模型，让当前模块都能使用该模型

```ts
import { User } from "./user.model";

export const userProviders = [
  {
    provide: 'UserRepository',
    useValue: User
  }
]
```

### 模块

```ts
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { userProviders } from "./user.providers";

@Module({
  imports: [],
  providers: [UserService, ...userProviders],
  controllers: [UserController]
})
export class UserModle { }
```

### 根模块

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './modules/student/student.module';
import { LogMiddleware, TestMiddleware } from './middleware';
import { StudentController } from './modules/student/student.controller';
import { FileModule } from './modules/file/file.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from "./database/database.module";

// 用户模型
import { User } from './modules/user/user.model';
import { UserModle } from './modules/user/user.module';
// 根模块，注册所有模块
@Module({
  // 路由模块通过imports中注册
  imports: [
    UserModle,
    DatabaseModule
  ],
})
export class AppModule  {}

```

### 数据库模块

```ts
import { Module } from "@nestjs/common";
import { databaseProviders } from "./database.providers";

@Module({
  providers: [...databaseProviders],
  exports:[...databaseProviders]
})
export class DatabaseModule { }
```

```ts
import { Provider } from "@nestjs/common"
import { Sequelize } from "sequelize-typescript"
import { User } from "src/modules/user/user.model"

export const databaseProviders:Provider[] = [
  {
    provide: 'SEQUELIZE',
    async useFactory() {
      // 建立连接
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'nest-study',
        
      })
      // 添加模型
      sequelize.addModels([
        User
      ])
      // 创建表
      await sequelize.sync({
        alter:true 
      })
      return sequelize
    }
  }
]
```



# 四、模块

Nest中使用Module装饰器来修饰一个模块。

`@module()` 装饰器接受一个描述模块属性的对象：

|             |                                                            |
| ----------- | ---------------------------------------------------------- |
| providers   | 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享 |
| controllers | 必须创建的一组控制器                                       |
| imports     | 导入模块的列表，这些模块导出了此模块中所需提供者           |
| exports     | 由本模块提供并应在其他模块中可用的提供者的子集。           |

https://docs.nestjs.cn/10/modules

## 1.Providers



## 2.Controllers



## 3.imports

​	imports接收一个数组，数组中每个元素都是一个模块，代表着导入该模块。这样模块就能使用导入模块的功能了。

## 4.exports

​	exports可以导出任意内容，导出后，其他模块在导入该模块时候就能使用导出的内容了。

### **共享模块**:

​	直接导出CatsService，这样只要导入CatsModule的模块都能访问到CatsService了。

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}

```

### **模块导出**:

直接导出该模块，这样导入CoreModule的模块就能使用CoreModule暴露的内容了。

```ts
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

### 全局模块

​	通过@Gobal修饰全局模块，只要导入一次该模块，就能在所有模块中访问该模块导出的内容了。

```ts
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}

```

`@Global` 装饰器使模块成为全局作用域。 全局模块应该只注册一次，最好由根或核心模块注册。 在上面的例子中，`CatsService` 组件将无处不在，而想要使用 `CatsService` 的模块则不需要在 `imports` 数组中导入 `CatsModule`。