import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // object为传入的表单（请求体或装饰的目标参数）
    const object = plainToInstance(metatype, value);
    // 校验表单
    const errors = await validate(object);

    // 出现错误了
    if (errors.length > 0) {
      if (errors[0].constraints) {
        // 获取校验失败的原因
        const tips = Object.values(errors[0].constraints)[0]
        throw new BadRequestException(`表单校验失败:${tips}`);
      } else {
        throw new BadRequestException('表单校验失败!')
      }
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
