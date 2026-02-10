import { IsString, MaxLength, MinLength, IsEmail } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @MaxLength(100)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(60)
  password!: string;
}
