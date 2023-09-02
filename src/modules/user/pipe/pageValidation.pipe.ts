import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";


export class PagePipe implements PipeTransform<string, number> {
  // PipeTransform接收两个泛型，第一个是管道入参类型，第二个是管道解析后返回的类型
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata);
    // value 是绑定的参数传入的数据
    // metadata 包含了该参数被装饰时的信息例如，装饰的是请求体？查询参数，路径参数等，data为装饰的形参名称
    const page = Number(value)
    if (isNaN(page)) {
      throw new BadRequestException('页码非法!')
    }
    if (page < 1) {
      throw new BadRequestException('页码必须大于等于1')
    }
    return page
  }
}