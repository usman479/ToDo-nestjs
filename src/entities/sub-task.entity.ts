import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from './task.entity';
// import { Comment } from './comment.entity';

@Entity()
export class SubTask {
  @PrimaryGeneratedColumn()
  subtask_id: number;

  @Column({ nullable: false })
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne((type) => Task, (task) => task.subTasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' }) // Specify the custom foreign key column name
  task: Task;

  @DeleteDateColumn()
  deleted_date: Date;
}
