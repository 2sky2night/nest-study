import { Controller, Get, Inject, UseGuards, Post, Body, HttpStatus, Param, ParseIntPipe } from "@nestjs/common";
import { AuthGuard } from "../user/guard/auth.guard";
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../user/pipe/validation.pipe";
import { PostCreateDto } from "./dto/post.create.dto";
import { PostCreateResponseDto } from "./dto/post.create.response.dto";
import { PostService } from "./post.service";
import { Token } from "src/decorator/token.decorator";
import { TokenParse } from "src/types/token";
import { RoleGuard } from "../user/guard/role.guard";
import { Roles } from "../user/decorator/roles.decorator";

@ApiTags("文章模块")
@Controller('post')
export class PostController {
  constructor(
    @Inject('Hello') private postList: any[],
    private postService: PostService
  ) { }

  // 测试依赖注入
  @UseGuards(AuthGuard)
  @Get('/test')
  testProvider() {
    return this.postList
  }

  @ApiOperation({
    summary: '创建帖子',
    description: '拥有权限的用户可以创建帖子'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '返回创建成功的帖子信息',
    type: PostCreateResponseDto
  })
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: '携带token，校验用户角色'
  })
  @Roles("Admin")
  @UseGuards(AuthGuard, RoleGuard)
  @Post('create')
  createPost(@Body(new ValidationPipe()) postCreateDto: PostCreateDto, @Token() token: TokenParse) {
    return this.postService.create(token.sub, postCreateDto)
  }
  @ApiParam({
    description: '帖子id',
    type: Number,
    example: 0,
    name: 'pid'
  })
  @Get('find/:pid')
  findPost(@Param('pid', ParseIntPipe) pid: number) {
    return this.postService.find(pid)
  }
  @UseGuards(AuthGuard)
  @Post('like/:pid')
  likePost(@Param('pid', ParseIntPipe) pid: number, @Token('sub') uid: number) {
    return this.postService.likePost(pid, uid)
  }
}