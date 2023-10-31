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
import { EncryptInterceptor } from 'src/interceptor/encrypt.interceptor';

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
    let user = await this.userService.findOne(req.user.sub.userId);
    return await this.taskService.createTask(body, user);
  }

  @Post('createsubtask')
  @Roles(AvailableRoles.User)
  async createSubTask(@Body() body: CreateSubTaskDto, @Request() req) {
    let user = await this.userService.findOne(req.user.sub.userId);
    return this.taskService.createSubTask(body, user);
  }

  @Get('getall')
  @Roles(AvailableRoles.User)
  async readAll(@Request() req) {
    return await this.taskService.getAllTasksByUserId(req.user.sub.userId);
  }

  @Delete('delete/task/:id')
  @Roles(AvailableRoles.User)
  async deleteTask(@Param('id') taskId: string, @Request() req) {
    let user = await this.userService.findOne(req.user.sub.userId);
    return this.taskService.deleteTask(parseInt(taskId), user);
  }

  @Delete('delete/subtask/:id')
  @Roles(AvailableRoles.User)
  async deleteSubTask(@Param('id') subTaskId: string, @Request() req) {
    let user = await this.userService.findOne(req.user.sub.userId);
    return this.taskService.deleteSubTask(parseInt(subTaskId), user);
  }

  @Patch('update/task/:id')
  @Roles(AvailableRoles.User)
  async updateTask(
    @Param('id') taskId: string,
    @Request() req,
    @Body() body: UpdateTaskDto,
  ) {
    let user = await this.userService.findOne(req.user.sub.userId);
    return this.taskService.updateTask(parseInt(taskId), user, body);
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
