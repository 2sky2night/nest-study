import { Provider } from "@nestjs/common";
import { Post } from "./post.model";
import { User } from "../user/user.model";
import { PostLike } from "./postLike.model";

export const PostProvider: Provider[] = [
  {
    provide: 'Hello',
    useFactory: () => [
      {
        title: '帖子标题',
        content: '帖子内容111'
      }
    ]
  },
  {
    provide: 'PostRepository',
    useValue: Post
  },
  {
    provide: 'UserRepository',
    useValue: User
  },
  {
    provide: 'PostLikeRepository',
    useValue: PostLike
  }
]