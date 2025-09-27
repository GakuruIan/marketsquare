import {
  IsString,
  MaxLength,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export enum UserRole {
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
}

export class CreateUserDTO {
  @IsString()
  clerkId!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  username: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  verified: boolean;

  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
