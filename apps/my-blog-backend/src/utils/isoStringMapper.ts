// apps/my-blog-backend/src/common/utils/mappers.ts

import { Comment, Like, Post } from '@prisma/client';
import { UserTapComment, UserTabPost } from '@my-blog/types';

// ✅ 1. Prisma가 반환하는 원본 데이터의 타입을 정의합니다.
// (Post 모델에 comments와 likes가 포함된 형태)
type PrismaPostWithRelations = Post & {
  comments: Comment[];
  likes: Like[];
};

// ✅ 2. 댓글 변환 로직 (작은 부품)
function mapCommentToDto(comment: Comment): UserTapComment {
  return {
    ...comment,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
}

// ✅ 3. 게시글 변환 로직 (메인 로직)
export function mapPostToDto(post: PrismaPostWithRelations): UserTabPost {
  return {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    // 'likes'는 이미 프론트엔드 타입과 일치하므로 변환 불필요

    // 위에서 만든 '작은 부품'을 사용합니다.
    comments: post.comments.map(mapCommentToDto),
  };
}
