import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class UserCreatePayload {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  roleId: number;

  @IsDefined()
  @MinLength(6)
  @IsString()
  @ApiProperty()
  password: string;
}
