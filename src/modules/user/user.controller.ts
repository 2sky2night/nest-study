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