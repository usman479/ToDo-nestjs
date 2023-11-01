import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Task } from 'src/entities/task.entity';
import { SubTask } from 'src/entities/sub-task.entity';
import { UserService } from 'src/user/user.service';
import { TaskService } from 'src/task/task.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EncryptInterceptor } from 'src/interceptor/encrypt.interceptor';

@Module({
  controllers: [AdminController],
  imports: [TypeOrmModule.forFeature([User, Task, SubTask])],
  providers: [
    UserService,
    TaskService,
  ],
})
export class AdminModule {}
