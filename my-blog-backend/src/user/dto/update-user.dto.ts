// src/user/dto/update-user.dto.ts

import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: '비밀번호 변경시 최소 8자 이상이어야 합니다.' })
  password?: string;

  @IsOptional()  
  @IsString()
  @MinLength(2, { message: '닉네임 변경시 최소 2자 이상이어야 합니다.' })
  nickname?: string;
}