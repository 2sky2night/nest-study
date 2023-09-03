import { BadRequestException, CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express";
import { User } from "src/modules/user/user.model";
import { SECRET_KEY } from "src/utils/encrpty";
import { UserService } from "src/modules/user/user.service";

// 要注入构造函数中的参数只有使用Injectable
@Injectable()
export class TokenParseInterceptor implements NestInterceptor {
  constructor(
    // 因为模块提供了这两个玩意，所以才能注入他们
    private jwtService: JwtService,
    // private userService: UserService
    @Inject('UserRepository') private readonly userRepository: typeof User,
  ) { }
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
    // next.handle可以调用路由处理函数
    // next.handle()
    const req = context.switchToHttp().getRequest<Request>()
    // 获取token
    const token = this.getTokenFromHeaders(req)
    // 解析token
    if (token === undefined) {
      // 调用路由处理函数
      return next.handle()
    }
    try {
      const playload = await this.jwtService.verifyAsync(token, { secret: SECRET_KEY })
      // 查询用户是否存在?
      const id = playload.sub
      const user = await this.userRepository.findByPk(id)
      if (user===null) {
        throw new Error('用户不存在!')
      }

      // 将token保存到上下文中
      // @ts-ignore
      req['user'] = playload
      // 调用路由处理函数
      return next.handle()
    } catch (error) {
      throw new UnauthorizedException(error.toString())
    }
  }
  getTokenFromHeaders(req: Request) {
    const authorization = req.headers.authorization
    if (authorization === undefined) {
      return undefined
    }
    const token = authorization.split(' ')[1]
    if (token === undefined) {
      return undefined
    } else {
      return token
    }
  }
}