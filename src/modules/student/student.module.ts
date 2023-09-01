import { Module } from "@nestjs/common";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";

/**
 * 学生根模块
 */
@Module({
  providers:[StudentService],
  controllers:[StudentController]
})
export class StudentModule{}