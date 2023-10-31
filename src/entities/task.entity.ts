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
import { User } from './user.entity';
import { SubTask } from './sub-task.entity';
// import { Comment } from './comment.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  task_id: number;

  @Column({ nullable: false })
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne((type) => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' }) // Specify the custom foreign key column name
  user: User;

  @OneToMany((type) => SubTask, (subTask) => subTask.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  subTasks: SubTask[];

  @DeleteDateColumn()
  deleted_date: Date;
}
