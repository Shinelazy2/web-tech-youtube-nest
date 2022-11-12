import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GoodsModule } from './goods/goods.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    GoodsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12341234',
      database: 'nestjs-db',
      autoLoadEntities: true,
      // entities: [User, Category, Question],
      synchronize: true,
    }),
    CategoryModule,
    QuestionModule,
    AuthModule,
  ],
})
export class AppModule {}
