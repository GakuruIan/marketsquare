import {
  IsString,
  MaxLength,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';

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
