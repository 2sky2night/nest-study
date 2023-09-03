import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { userProviders } from "./user.providers";
import { JwtModule } from '@nestjs/jwt'
import { SECRET_KEY } from "src/utils/encrpty";
import { TokenParseMiddleware } from "src/middleware/token";
import { PostModule } from "../post/post.module";

@Module({
  imports: [
    PostModule,
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: {
        expiresIn: '2h'
      }
    })
  ],
  providers: [UserService, ...userProviders],
  controllers: [UserController]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenParseMiddleware)
      .forRoutes(
        {
          // 注意把请求路径写全
          path: '/user/publicToken',
          method: RequestMethod.GET
        }
      )
  }
}