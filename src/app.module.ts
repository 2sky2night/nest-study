import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './modules/student/student.module';
import { LogMiddleware, TestMiddleware } from './middleware';
import { StudentController } from './modules/student/student.controller';
import { FileModule } from './modules/file/file.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from "./database/database.module";

// 用户模型
import { User } from './modules/user/user.model';
import { UserModle } from './modules/user/user.module';
// 根模块，注册所有模块
@Module({
  // 路由模块通过imports中注册
  imports: [
    StudentModule,
    FileModule,
    UserModle,
    DatabaseModule
  ],
  // 控制层在这里注册
  controllers: [AppController],
  // service层在这里注册
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 只有student模块的路由才会触发中间件
    consumer.apply(LogMiddleware,TestMiddleware).forRoutes(StudentController)
  }
}
