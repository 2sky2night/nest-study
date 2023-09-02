import { Column, Comment, Model, Table, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

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
}


