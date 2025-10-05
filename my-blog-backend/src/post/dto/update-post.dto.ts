// src/post/dto/update-post.dto.ts

// '게시글 수정' 시에는 일부 필드만 선택적으로 변경하는 경우가 많으므로,
// 모든 프로퍼티를 '선택적(optional)' 프로퍼티로 만드는 것이 일반적입니다.
export class UpdatePostDto {
  title?: string;
  content?: string;
}