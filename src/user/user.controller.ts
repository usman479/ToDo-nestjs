import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateSubTaskDto, CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from 'src/task/task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import AvailableRoles from 'src/roles';

@Controller('user')
@UseGuards(JwtGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  @Post('createtask')
  @Roles(AvailableRoles.User)
  async createTask(@Body() body: CreateTaskDto, @Request() req) {
    try {
      let user = await this.userService.findOne(req.user.sub.userId);
      const response = await this.taskService.createTask(body, user);
      return {
        response,
        status: true,
      };
    } catch (e) {
      return {
        response: e,
        status: false,
      };
    }
  }

  @Post('createsubtask')
  @Roles(AvailableRoles.User)
  async createSubTask(@Body() body: CreateSubTaskDto, @Request() req) {
    try {
      let user = await this.userService.findOne(req.user.sub.userId);
      const response = await this.taskService.createSubTask(body, user);
      console.log(response)
      return {
        response,
        status: true,
      };
    } catch (e) {
      return {
        response: e,
        status: false,
      };
    }
  }

  @Get('getall')
  @Roles(AvailableRoles.User)
  async readAll(@Request() req) {
    try {
      const response = await this.taskService.getAllTasksByUserId(req.user.sub.userId);
      return {
        response,
        status: true,
      };
    } catch (e) {
      return {
        response: e,
        status: false,
      };
    }
  }

  @Delete('delete/task/:id')
  @Roles(AvailableRoles.User)
  async deleteTask(@Param('id') taskId: string, @Request() req) {
    try {
      let user = await this.userService.findOne(req.user.sub.userId);
      const response = await this.taskService.deleteTask(parseInt(taskId), user);
      
      return {
        response,
        status: true,
      };
    } catch (e) {
      return {
        response: e,
        status: false,
      };
    }
  }

  @Delete('delete/subtask/:id')
  @Roles(AvailableRoles.User)
  async deleteSubTask(@Param('id') subTaskId: string, @Request() req) {
    try {
      let user = await this.userService.findOne(req.user.sub.userId);
      const response = await this.taskService.deleteSubTask(parseInt(subTaskId), user);
      return {
        response,
        status: true,
      };
    } catch (e) {
      return {
        response: e,
        status: false,
      };
    }
  }

  @Patch('update/task/:id')
  @Roles(AvailableRoles.User)
  async updateTask(
    @Param('id') taskId: string,
    @Request() req,
    @Body() body: UpdateTaskDto,
  ) {
    try {
      let user = await this.userService.findOne(req.user.sub.userId);
      const response = await this.taskService.updateTask(parseInt(taskId), user, body);
      
      return {
        response,
        status: true,
      };
    } catch (e) {
      return {
        response: e,
        status: false,
      };
    }
  }

  // @Roles('user')
  // @UseGuards(JwtGuard, RolesGuard)
  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.userService.findOne(id);
  // }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @UseGuards(JwtGuard)
  // @Get(':id/comments')
  // getUserComment(@Param('id') id: string) {
  // return this.commentService.findUserComments(id);
  // }
}
