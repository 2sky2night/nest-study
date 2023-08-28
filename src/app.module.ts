import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './modules/user/user.controller';
// 根模块，注册所有模块
@Module({
  imports: [],
  controllers: [AppController,UserController],
  providers: [AppService],
})
export class AppModule {}
