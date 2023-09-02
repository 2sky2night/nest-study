import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { UserCreateDto } from "./dto/user.create.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: typeof User
  ) { }
  async findAll() {
    return await this.userRepository.findAll()
  }
  async createUser(userInfo: UserCreateDto) {
    // 查询用户名是否重复
    const user = await this.findUserByUsername(userInfo.username)
    if (user !== null) {
      // 用户名重复!
      throw new BadRequestException('用户名重复!')
    }
    // 插入用户记录
    const userIns = new User()
    userIns.set('username', userInfo.username)
    userIns.set('password', userInfo.password)
    await userIns.save()
    return '注册成功!'
  }
  async findUserByUsername(username: string) {
    // 通过username查询某个用户名称是否存在
    const user = await this.userRepository.findOne({
      where: {
        username
      }
    })
    return user
  }
  async findUser(user_id: number) {
    const user = await this.userRepository.findByPk(user_id)
    if (user) {
      return user
    } else {
      throw new NotFoundException('此用户id不存在!')
    }
  }
  async removeUser(user_id: number) {
    const user = await this.findUser(user_id)
    await user.destroy()
    return '删除用户成功'
  }
  async updateUser(user_id: number, { username, password }: { username: string, password: string }) {
    const user = await this.findUser(user_id)
    // 直接更新
    user.username=username
    user.password = password
    await user.save()
    return user
  }
}