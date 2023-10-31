import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TaskService } from 'src/task/task.service';
import { Task } from 'src/entities/task.entity';
import { SubTask } from 'src/entities/sub-task.entity';
import { DecryptionMiddleware } from 'src/middleware/decryption.middleware';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EncryptInterceptor } from 'src/interceptor/encrypt.interceptor';
// import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task, SubTask]),
    ConfigModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    TaskService,
    { provide: APP_INTERCEPTOR, useClass: EncryptInterceptor },
  ],
})
export class UserModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(DecryptionMiddleware).forRoutes('*')
  }
}
