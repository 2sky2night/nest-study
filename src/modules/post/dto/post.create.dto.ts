import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Length, IsNotEmpty, IsString } from "class-validator";

export class PostCreateDto {
  @ApiProperty({
    description: '文章标题',
    type: String,
    example: "我是标题!",
    maxLength: 15,
    minLength: 3
  })
  @Length(3, 15, { message: '文章标题长度为3-15个字符!' })
  @IsNotEmpty({ message: '标题长度不能为空' })
  readonly title: string;

  @ApiProperty({
    description: '文章内容',
    type: String,
    example: "我是文章内容",
    maxLength: 9999,
    minLength: 1
  })
  @Length(1, 9999, { message: '文章内容长度为1-99个字符!' })
  @IsNotEmpty({ message: '文章内容长度不能为空' })
  readonly content: string;
  
  // 可选参数
  // @ApiPropertyOptional()
}