// src/api/posts.ts

import type {
  GetPostReturn,
  UpdatePostData,
  CreatePostData,
  PostForMainPage,
  Post,
  PostForSearchPage,
} from '@my-blog/types';

import apiClient from './client';

// ------------------ search page posts------------------- //
/** post for search page */
export const getPostsForSearchPage = async (): Promise<PostForSearchPage[]> => {
  const posts: PostForSearchPage[] = await apiClient.get('/search/posts');
  return posts;
};
/** search logic */
export const searchPosts = async (keyword: string): Promise<PostForSearchPage[]> => {
  const posts: PostForSearchPage[] = await apiClient.get(`search/result?q=${keyword}`);
  return posts
} 


// ------------------ main page posts ------------------- //
/** post for main page (시작 메인페이지) */
export const getPostsForMainPage = async (): Promise<PostForMainPage[]> => {
  const allPosts: PostForMainPage[] = await apiClient.get('/posts');
  return allPosts;
};

/** post for '/posts/[id]' (상세페이지) */
export const getPostById = async (postId: number): Promise<GetPostReturn> => {
  const post: GetPostReturn = await apiClient.get(`/posts/${postId}`);
  return post;
};

/** create Post 포스트 쎄리 만들어삐라 씨바꺼 */
export const createPost = async (newPost: CreatePostData): Promise<Post> => {
  const createPost: Post = await apiClient.post('/posts', newPost);
  return createPost;
};

/** update 하기 전 포스트의 데이터를 가져옵니다. post edit page */
export const getPostForEdit = async (postId: number): Promise<Post> => {
  const post: Post = await apiClient.get(`posts/${postId}/edit`);
  return post;
};

interface UpdatePost {
  postId: number;
  updatePostData: UpdatePostData;
}
/** update post by postId and updatePostData */
export const updatePost = async ({
  postId,
  updatePostData,
}: UpdatePost): Promise<Post> => {
  const post: Post = await apiClient.patch(
    `/posts/${postId}/edit`,
    updatePostData,
  );
  return post;
};

interface DeletePostReturn {
  message: string;
}
/** delete post by postId */
export const deletePost = async (postId: number): Promise<DeletePostReturn> => {
  const deletePostReturn: DeletePostReturn = await apiClient.delete(
    `/posts/${postId}`,
  );
  return deletePostReturn;
};
