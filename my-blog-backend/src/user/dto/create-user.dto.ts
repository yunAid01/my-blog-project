// src/user/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // @IsEmail(): 이메일 형식인지 검증합니다.
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @MinLength(8, ...): 최소 8자 이상이어야 함을 검증합니다.
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password: string;
}