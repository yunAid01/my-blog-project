// src/types/post.ts

export type Post = {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
};