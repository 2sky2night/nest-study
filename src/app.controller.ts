import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// 根控制层
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/get')
  getTest () {
    // get请求
    return this.appService.getTest();
  }

}
