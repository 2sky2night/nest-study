import { Column, Comment, Model, Table, PrimaryKey, AutoIncrement, DataType, NotNull, Default, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Post } from '../post/post.model';
import { PostLike } from '../post/postLike.model';

/**
 * 用户模型
 */
@Table({
  modelName: 'user',
  tableName: 'user'
})
export class User extends Model<User> {
  // colunm装饰器必须在最下面，否则一直报错
  @PrimaryKey
  @AutoIncrement
  @Comment('用户id')
  @Column(DataType.INTEGER)
  user_id: number;

  @Comment('用户名称')
  @Column
  username: string;

  @Comment('用户密码')
  @Column
  password: string;

  @Column
  updatedAt: Date;

  @Column
  createdAt: Date;

  @Default("User")
  @Comment("用户角色")
  @Column({
    type: DataType.ENUM('Admin', "User")
  })
  role: "Admin" | "User"
  // 一个用户有多个文章
  @HasMany(() => Post)
  posts: Post[]

  // 一个用户可以点赞多个帖子
  @BelongsToMany(() => Post, () => PostLike)
  likePostList: Post[];
}


