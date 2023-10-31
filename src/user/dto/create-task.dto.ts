import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  text: string;
}

export class CreateSubTaskDto extends PartialType(CreateTaskDto) {
  @IsNumber()
  task_id: number;
}
