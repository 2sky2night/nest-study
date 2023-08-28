import { Controller,Get,Post,Req,Res } from '@nestjs/common';
import { Request,Response } from 'express';

// 装饰器传入该控制器的根路径
// 只要是该根路径的请求就下发到该控制层中
@Controller('/user')
export class UserController {
  @Get('/info')
  getUserInfo (@Req() req: Request, @Res() res: Response) {
    // 若需要解析请求体数据或查询参数可以使用req请求上下文来获取数据
    // 若使用了参数装饰器装饰了res参数，就必须手动调用send方法结束整个请求中间件
    // 响应数据
    res.send({
      name: 'Mark',
      age:18
    })
  }
  @Post('/add')
  addUser (@Req() req: Request) {
    
  }
}