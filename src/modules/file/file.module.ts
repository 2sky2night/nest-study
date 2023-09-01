import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [MulterModule.register({
    limits: {
      // 限制文件大小为1mb
      fileSize:1024*1024,
    }
  })],
  controllers:[FileController]
})
export class FileModule {}