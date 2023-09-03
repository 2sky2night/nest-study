import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { SECRET_KEY } from "src/utils/encrpty";

// 解析token的中间件
// Injectable装饰器的作用可以将构造函数中的参数内容全部都注入到示例中
@Injectable()
export class TokenParseMiddleware implements NestMiddleware {
  // jwtService=new JwtService()
  // 注入Jwt服务层,中间件也可以注入内容
  constructor(private jwtService: JwtService) { }
  async use(req: Request, _res: Response, next: NextFunction) {
    console.log('中间件');
    console.log(this.jwtService);
    
    const token = this.getTokenFromHeader(req)
    if (token === undefined) {
      // 无token直接放行
      next()
    } else {
      // 有token，需要解析出token
      console.log(token);
      try {
        const user = await this.jwtService.verifyAsync(token, { secret: SECRET_KEY })
        // @ts-ignore
        req['user']=user
        next()
      } catch (error) {
        console.log(error.toString());
        if (error.toString() === 'TokenExpiredError: jwt expired') {
          throw new UnauthorizedException('token过期，请重新登录!')
        } else {
          throw new UnauthorizedException('token非法!')
        }
      }
      
    }

  }
  private getTokenFromHeader(req: Request) {
    const authorization = req.headers.authorization
    if (authorization === undefined) {
      return undefined
    }
    // 默认为Bearer类型的token
    const token = authorization.split(' ')[1]
    if (token !== undefined) {
      return token
    } else {
      return undefined
    }
  }
}