// src/post/dto/create-post.dto.ts

// DTO(Data Transfer Object)는 계층 간 데이터 교환을 위한 객체입니다.
// 즉, 클라이언트가 서버에 데이터를 보낼 때
// 어떤 형식으로 보내야 하는지 정의하는 '틀' 또는 '설계도'입니다.

// class-validator에서 필요한 데코레이터들을 import 합니다.
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  // 게시글의 제목. string 타입이어야 합니다.
  @IsString()
  @IsNotEmpty()
  title: string;

  // 게시글의 내용. string 타입이며, 필수는 아닙니다.
  // '?'는 이 필드가 없어도 괜찮다는 '선택적(optional)' 프로퍼티임을 의미합니다.
  @IsString()
  @IsOptional()
  content?: string;
}