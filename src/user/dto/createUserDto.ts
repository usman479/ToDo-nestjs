import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEmail, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
  
  @IsBoolean()
  admin:boolean;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
