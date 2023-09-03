import { AutoIncrement, Column, Model, PrimaryKey, Table, Comment, DataType, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { User } from "../user/user.model";
import { PostLike } from "./postLike.model";

@Table({
  tableName: 'post'
})
export class Post extends Model<Post>{
  @AutoIncrement
  @Comment('文章id')
  @PrimaryKey
  @Column(DataType.INTEGER)
  pid: number;

  @Comment('帖子标题')
  @Column(DataType.STRING)
  title: string;

  @Comment('帖子内容')
  @Column(DataType.TEXT)
  content: string;

  // 创建的user外键,(自动引用User模型的主键)
  @ForeignKey(() => User)
  @Column
  uid: number;
  // 一个文章属于一个用户
  @BelongsTo(() => User)
  user: User
  // 一个帖子可以被多个用户点赞
  @BelongsToMany(() => User, () => PostLike)
  liked: User[];
}