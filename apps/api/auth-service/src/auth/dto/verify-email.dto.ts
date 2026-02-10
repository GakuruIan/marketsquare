import { IsString } from 'class-validator';

export class VerifyEmailDTO {
  @IsString()
  authId!: string;

  @IsString()
  code!: string;

  @IsString()
  userAgent!: string;

  @IsString()
  ipAddress!: string;
}
