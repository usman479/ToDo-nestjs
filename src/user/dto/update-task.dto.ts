import {  IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTaskDto {

  @IsString()
  @IsOptional()
  text: string;
  
  @IsBoolean()
  @IsOptional()
  completed: boolean;

}
