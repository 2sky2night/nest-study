import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../user/user.model";
import { Post } from "./post.model";

@Table({
  tableName: "post_like"
})
export class PostLike extends Model<PostLike> {
  @ForeignKey(() => User)
  @Column
  uid: number

  @ForeignKey(() => Post)
  @Column
  pid: number
}