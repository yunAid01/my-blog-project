// src/types/post.ts
export type Post = {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  // author 필드를 추가합니다.
  author: {
    id: number;
    email: string;
    nickname: string;
  };
  likes: {
    userId: number;
    postId: number;
    author: {
      id: number;
      nickname: string;
    }
  }
};