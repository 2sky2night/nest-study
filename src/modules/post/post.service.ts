import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PostCreateDto } from "./dto/post.create.dto";
import { Post } from "./post.model";
import { User } from "../user/user.model";

@Injectable()
export class PostService {
  constructor(
    @Inject('PostRepository') private PostRepository: typeof Post,
    @Inject('UserRepository') private UserRepository: typeof User,
    @Inject('PostLikeRepository') private PostLikeRepository: typeof User,

  ) { }
  async create(uid: number, postCreateDto: PostCreateDto) {
    // 创建帖子
    // @ts-ignore
    const post = await this.PostRepository.create({
      title: postCreateDto.title,
      content: postCreateDto.content,
      uid: uid
    })
    return post
  }
  async find(pid: number) {
    const post = await this.PostRepository.findByPk(pid)
    if (post === null) {
      throw new NotFoundException('未找到文章!')
    }
    return post
  }
  async likePost(pid: number, uid: number) {
    // 查询帖子是否存在
    await this.find(pid)
    // 存在则插入记录
    // @ts-ignore
    await this.PostLikeRepository.create({ pid, uid })

    return 'ok'
  }
}