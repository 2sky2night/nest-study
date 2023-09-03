import { ApiProperty } from "@nestjs/swagger";

export class PostCreateResponseDto {
  @ApiProperty({
    description: '文章标题',
    type: String,
    example: "我是标题!",
  })
  readonly title: string;

  @ApiProperty({
    description: '文章内容',
    type: String,
    example: "我是文章内容",
  })
  readonly content: string;
  @ApiProperty({
    description: '文章id',
    type: Number,
    example: "1"
  })
  pid: number;
  @ApiProperty({
    description: '用户id，文章作者的id',
    type: Number,
    example: "1"
  })
  uid: number;
  @ApiProperty({
    description: '更新时间',
    type: Number,
    example: "2023-09-03T10:34:51.212Z"
  })
  updatedAt: String;
  @ApiProperty({
    description: '创建时间',
    type: Number,
    example: "2023-09-03T10:34:51.212Z"
  })
  createdAt: String;
}