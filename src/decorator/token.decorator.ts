
import { BadGatewayException, createParamDecorator, ExecutionContext } from '@nestjs/common';

// 将上下文中保存的token数据拿出来
export const Token = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // data是参数装饰器中传入的值
    // @Token('sub') 则data==='sub'
    const request = ctx.switchToHttp().getRequest();
    if (data === undefined) {
      return request.user;
    } else {
      const value = request.user[data]
      if (value === undefined) {
        throw new BadGatewayException(`token has not a key named ${data}`)
      } else {
        return value
      }
    }
  },
)
