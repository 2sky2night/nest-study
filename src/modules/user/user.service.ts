import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.model";
import { UserCreateDto } from "./dto/user.create.dto";
import { UserLoginDto } from "./dto/user.login.dto";
import { SECRET_KEY, decrpty, encrpty } from "src/utils/encrpty";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: typeof User,
    private readonly jwtService: JwtService
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
    user.username = username
    user.password = encrpty(password,SECRET_KEY)
    await user.save()
    return user
  }
  async login({ username, password }: UserLoginDto) {
    // 查询用户名是否存在
    const user = await this.findUserByUsername(username)
    if (user === null) {
      throw new BadRequestException('用户名不存在!')
    }
    // 解密用户密码
    const _password = decrpty(user.get('password'), SECRET_KEY)
    if (_password === password) {
      const id = user.get('user_id')
      const token = await this.jwtService.signAsync({
        sub: id,
        username: user.username,
        role:user.role
      })
      return {
        token
      }
    } else {
      throw new BadRequestException('用户名或密码错误!')
    }
  }
  async register({ username, password }: UserCreateDto) {
    // 查询用户名是否有重复
    if (await this.findUserByUsername(username)) {
      throw new BadRequestException('用户名存在!')
    }
    // 加密密钥
    const encrptyStr = encrpty(password, SECRET_KEY)
    // 保存用户信息
    // @ts-ignore
    const user = await this.userRepository.create({
      username,
      password: encrptyStr
    })
    return user
  }
}