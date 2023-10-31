import { Controller,Post,Get,Body,Request,Delete,Param,Patch, UseGuards } from '@nestjs/common';
import { TaskService } from 'src/task/task.service';
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateSubTaskDto, CreateTaskDto } from 'src/user/dto/create-task.dto';
import { UpdateTaskDto } from 'src/user/dto/update-task.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import AvailableRoles from 'src/roles';



@Controller('admin')
@UseGuards(JwtGuard,RolesGuard)
export class AdminController {
    constructor(
        private readonly userService: UserService,
        private readonly taskService: TaskService,
      ) {}
    

      @Get('getuser')
      @Roles(AvailableRoles.Admin)
      async getUser(){
        return this.userService.getAllUsers();
      }

      @Get('getuser/:id')
      @Roles(AvailableRoles.Admin)
      async getUserById(@Param('id') id:string){
        return this.userService.findOne(parseInt(id));
      }
      
      @Delete('deletetask/:id')
      @Roles(AvailableRoles.Admin)
      async deleteTask(@Param('id') id:string) {
          return this.taskService.deleteTaskAdmin(parseInt(id))
      }

      @Delete('deletesubtask/:id')
      @Roles(AvailableRoles.Admin)
      async deleteSubTask(@Param('id') id:string) {
          return this.taskService.deleteSubTaskAdmin(parseInt(id))
      }
      
}
