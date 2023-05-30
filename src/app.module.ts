import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TodosModule,
    MongooseModule.forRoot(
      'mongodb+srv://dandychux:HYTsXNpQxa1leUEc@nest-todo-api.9rwtfpq.mongodb.net/',
      { dbName: 'Todo-API' },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
