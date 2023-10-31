import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import config from 'ormconfig';
import { User } from './entities/user.entity';
import { AdminModule } from './admin/admin.module';
import { Task } from './entities/task.entity';
import { SubTask } from './entities/sub-task.entity';
import { TaskService } from './task/task.service'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Task, SubTask],
      synchronize: true,
    }),
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
