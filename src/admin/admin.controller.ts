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
        try {
          const response = await this.userService.getAllUsers();
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

      @Get('getuser/:id')
      @Roles(AvailableRoles.Admin)
      async getUserById(@Param('id') id:string){
        try {
          const response = await this.userService.findOne(parseInt(id));
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
      
      @Delete('deletetask/:id')
      @Roles(AvailableRoles.Admin)
      async deleteTask(@Param('id') id:string) {
        try {
          const response = await this.taskService.deleteTaskAdmin(parseInt(id))
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

      @Delete('deletesubtask/:id')
      @Roles(AvailableRoles.Admin)
      async deleteSubTask(@Param('id') id:string) {
        try {
          const response = await this.taskService.deleteSubTaskAdmin(parseInt(id))
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
      
}
