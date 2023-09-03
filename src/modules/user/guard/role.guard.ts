import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
  // Reflector用来访问路由元数据
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 通过reflector读取到路由元数，读取哪些角色可以调用该路由
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    // 在前置的auth守卫中解析了保存到了上下文中，所以可以通过request访问到用户的token信息
    const request = context.switchToHttp().getRequest<Request>()
    // 获取当前用户的角色
    // @ts-ignore
    const { role } = request['user']
    if (roles.includes(role)) {
      return true
    } else {
      throw new ForbiddenException('无权限访问!')
    }
  }
}