import { Injectable } from "@nestjs/common";

@Injectable()
export class StudentService{
  getStudentList() {
    return [
      {
        name: '张三',
        age: 18
      },
      {
        name: '李四',
        age: 20
      }
    ]
  }
}