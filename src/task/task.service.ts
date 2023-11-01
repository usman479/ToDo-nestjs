import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubTask } from 'src/entities/sub-task.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { CreateSubTaskDto, CreateTaskDto } from 'src/user/dto/create-task.dto';
import { UpdateTaskDto } from 'src/user/dto/update-task.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(SubTask) private subTaskRepo: Repository<SubTask>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    let newTask = { ...createTaskDto, user };
    const task = this.taskRepo.create(newTask);
    await this.taskRepo.save(task);
    return task;
  }

  async createSubTask(body: CreateSubTaskDto, user: User) {
    // const isAllowed = await this.taskRepo.find({where:{task_id:body.task_id,user:user.user_id}});

    const task = await this.taskRepo
      .createQueryBuilder('task')
      .where('task.user = :userId', { userId: user.user_id })
      .andWhere('task.task_id = :taskId', { taskId: body.task_id })
      .getOne();

    if (task) {
      const newSubTask = { text: body.text, task };
      const createSubTask = this.subTaskRepo.create(newSubTask);
      return this.subTaskRepo.save(createSubTask);
    }

    throw new UnauthorizedException('not allowed');
  }

  async deleteTask(taskId: number, user: User) {

    const isAllowed = await this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.subTasks', 'subTask')
      .where('task.user = :userId', { userId: user.user_id })
      .andWhere('task.task_id = :taskId', { taskId })
      .getOne();

    if(!isAllowed){
      throw new NotFoundException(`Task with the id ${taskId} not found`);
    } else if (isAllowed.subTasks.length > 0) {
      throw new UnauthorizedException(
        'delete the subtasks before deleting task',
      );
    }

    const task = await this.taskRepo
      .createQueryBuilder('task')
      .softDelete()
      .where('task_id = :taskId', { taskId })
      .andWhere('task.user_id = :user', { user: user.user_id })
      .execute();
    return task;
  }

  async deleteSubTask(subTaskId: number, user: User) {
    const isAllowed = await this.subTaskRepo
      .createQueryBuilder('subtask')
      .leftJoin('subtask.task', 'task') // Join the 'task' relationship
      .leftJoin('task.user', 'user') // Join the 'user' relationship
      .select('user.user_id', 'user_id') // Select the user_id
      .where('subtask.subtask_id = :subTaskId', { subTaskId })
      .getRawOne();

    if(!isAllowed){
      throw new NotFoundException(`Sub task with the id ${subTaskId} not found`);
    } else if (isAllowed.user_id !== user.user_id) {
      throw new UnauthorizedException('Not allowed');
    }

    const deleteQueryResult = await this.subTaskRepo
      .createQueryBuilder('subtask')
      .softDelete()
      .where('subtask_id = :subTaskId', { subTaskId })
      .execute();

    return deleteQueryResult;
  }

  async deleteTaskAdmin(taskId:number){

    const taskk = await this.taskRepo.findOne({where:{task_id:taskId},relations:['subTasks']});

    const removed = await this.taskRepo.softRemove(taskk);

    // const task = await this.taskRepo
    //   .createQueryBuilder('task')
    //   .softDelete()
    //   .where('task_id = :taskId', { taskId })
    //   .execute();

    return removed;
  }
  
  async deleteSubTaskAdmin(taskId:number){
    const task = await this.subTaskRepo
      .createQueryBuilder('task')
      .softDelete()
      .where('subtask_id = :taskId', { taskId })
      .execute();

    return task;
  }

  async updateTask(taskId: number, user: User,body:Partial<UpdateTaskDto>) {

    const isAllowed = await this.taskRepo.findOne({
      where: { task_id: taskId },
      relations: ['user'],
    });

    if(isAllowed.user.user_id !== user.user_id){
      throw new UnauthorizedException('Not allowed')
    }


    const task = await this.taskRepo.findOne({where:{task_id:taskId}})
    const updatedTask = this.taskRepo.merge(task,body);


    // Object.assign(task, body);

    // const updateQueryResult = await this.taskRepo.update({...bod})

    return await this.taskRepo.save(updatedTask);
  }

  async getAllTasksByUserId(id: number) {
    const task = await this.taskRepo.find({
      where: { user: { user_id: id } },
      relations: ['subTasks'],
    });
    return task;
  }

  

}
