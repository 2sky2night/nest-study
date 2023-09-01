import { Body, Controller, Get, Ip, Query, Res, NotFoundException, Post, HttpCode, Headers, Header, Param } from "@nestjs/common";
import { StudentService } from "./student.service";
import { NextFunction, Response, query } from "express";
import { CreateStudentDto } from "./student.dto";

@Controller('student')
export class StudentController {
  constructor(private readonly studentServiceImp: StudentService) { }
  @Get('list')
  getStudentList() {
    return this.studentServiceImp.getStudentList()
  }
  @Get('decorators')
  testDecorators(@Query() query: any, @Res() res: Response) {
    // 在处理函数中，第一个为req，第二个为res,第三个参数为next
    // 使用装饰器来获取到req或res
    // 使用了res装饰器，必须调用res.send结束响应。
    // 第一个参数只能使用req相关的装饰器，如@Req，@Body，@query等
    console.log(query);
    res.send(query)
  }
  @Get('/query')
  testQuery(@Query() query: any) {
    return query
  }
  @Post('/post')
  @HttpCode(200)
  @Header('app-type', 'Nest.js')
  testPost(@Body() body: any) {
    return body
  }
  @Get(':id/:name')
  getOne(@Param() params: any) {
    // 路由参数，动态的参数，执行同一个处理函数
    return params
  }
  @Post('add')
  async createStudent(@Body() student: CreateStudentDto) {
    throw new NotFoundException('未找到学生!');
    return student
  }
}
