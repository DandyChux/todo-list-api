import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from '~/env';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TodosModule,
    MongooseModule.forRoot(`${env.DB_URL}`, { dbName: env.MONGO_DB }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
