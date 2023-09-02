import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { userProviders } from "./user.providers";

@Module({
  imports: [],
  providers: [UserService, ...userProviders],
  controllers: [UserController]
})
export class UserModle { }