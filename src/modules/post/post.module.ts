import { Module } from "@nestjs/common";
import { PostProvider } from "./post.provider";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
  controllers: [PostController],
  providers: [...PostProvider,PostService],
  exports: [...PostProvider]
})
export class PostModule { }