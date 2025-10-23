// src/post/dto/update-post.dto.ts

import { IsOptional, IsString } from 'class-validator';

// '게시글 수정' 시에는 일부 필드만 선택적으로 변경하는 경우가 많으므로,
// 모든 프로퍼티를 '선택적(optional)'으로 만드는 것이 일반적입니다.

export class UpdatePostDto {
  // @IsOptional(): 이 필드는 선택 사항입니다. (요청 본문에 없어도 통과)
  // @IsString(): 단, 이 필드가 요청 본문에 존재할 경우에는 반드시 문자열 타입이어야 합니다.
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
