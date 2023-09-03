import { Provider } from "@nestjs/common"
import { Sequelize } from "sequelize-typescript"
import { Post } from "src/modules/post/post.model"
import { PostLike } from "src/modules/post/postLike.model"
import { User } from "src/modules/user/user.model"

export const databaseProviders:Provider[] = [
  {
    provide: 'SEQUELIZE',
    async useFactory() {
      // 建立连接
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'nest-study',
        
      })
      // 添加模型
      sequelize.addModels([
        User,Post,PostLike
      ])
      // 创建表
      await sequelize.sync({
        alter:true 
      })
      return sequelize
    }
  }
]