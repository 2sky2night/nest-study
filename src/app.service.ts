import { Injectable } from '@nestjs/common';

// 根服务
@Injectable()
export class AppService {
  getHello (): string {
    return 'Hello World!';
  }
  getTest () {
    return {
      name: 'Mark',
      year: 18
    }
  }
}
