import { Max, Min, IsString, IsNotEmpty, Length } from 'class-validator'

export class UserUpdateDto {
  @IsString({ message: '用户名为一个字符串!' })
  @IsNotEmpty({ message: '用户名不能为空!' })
  @Length(1, 10, { message: '用户名字段长度为1-10!' })
  readonly username: string;
  @IsString({ message: '密码为一个字符串!' })
  @IsNotEmpty({ message: '密码不能为空!' })
  @Length(6, 14, { message: '密码字段长度为6-14!' })
  readonly password: string;
}