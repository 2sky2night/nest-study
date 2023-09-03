import { Controller, Get, Post, Body, BadRequestException, Query, Delete, ParseIntPipe, UsePipes, Param, Put, UseGuards, Req, Header, SetMetadata, UseInterceptors, Inject } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/user.create.dto";
import { ValidationPipe } from "./pipe/validation.pipe";
import { PagePipe } from "./pipe/pageValidation.pipe";
import { UserUpdateDto } from "./dto/user.update.dto";
import { UserLoginDto } from "./dto/user.login.dto";
import { SECRET_KEY, encrpty } from "src/utils/encrpty";
import { AuthGuard } from "./guard/auth.guard";
import { Request } from "express";
import { RoleGuard } from "./guard/role.guard";
import { Roles } from "./decorator/roles.decorator";
import { TokenParseInterceptor } from "src/interceptors/token/token.interceptor";

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject('Hello') private postList:any[]
  ) { }
  @Get('list')
  async getUserList() {
    this.postList.pop()
    console.log(this.postList)
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
  // 必须携带token才能更新用户数据
  @UseGuards(AuthGuard)
  @Put('update/:id')
  async updateUser(@Param('id', ParseIntPipe) user_id: number, @Body(new ValidationPipe()) userUpdateDto: UserUpdateDto) {
    return await this.userService.updateUser(user_id, userUpdateDto)
  }
  // 登录
  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: UserLoginDto) {
    return this.userService.login(loginDto)
  }
  @Post('register')
  async register(@Body(new ValidationPipe()) userCreateDto: UserCreateDto) {
    return this.userService.register(userCreateDto)
  }
  // 自定义管道测试
  @Get('pipe')
  testPipe(@Query('page', new PagePipe()) page: number) {
    return page
  }
  // 解析token
  @UseGuards(AuthGuard)
  @Get('token')
  testToken(@Req() req: Request) {
    // @ts-ignore
    return req['user']
  }
  // 中间件解析token保存到上下文
  // 有token没token都能访问，不过响应的内容不一样
  @Get('publicToken')
  testMiddlewareToken(@Req() req: Request) {
    // @ts-ignore
    const user = req.user
    return user ? user : '未携带token，给你看点公共的内容!'
  }
  // 给路由处理函数设置元数据 roles：User
  // @SetMetadata('roles', ['User'])
  @Roles('User')
  // 守卫的执行顺序按照注册的顺序来的
  @UseGuards(AuthGuard, RoleGuard)
  @Get('role/user')
  testRoleUser() {
    return 'user角色才能看的'
  }
  @SetMetadata('roles', ['Admin'])
  @UseGuards(AuthGuard, RoleGuard)
  @Get('role/admin')
  testRoleAdmin() {
    return '管理员才能看的'
  }
  // 拦截器解析token保存到上下文中
  @UseInterceptors(TokenParseInterceptor)
  @Get('token/interceptor')
  testTokenInterceptor(@Req() req: Request) {
    // @ts-ignore
    return req.user ? req.user : '未携带token'
  }
}