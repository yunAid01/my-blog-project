'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Post, UpdatePostData } from '@my-blog/types';
import { getPostForEdit, updatePost } from '@/api/posts';
import { useParams, useRouter } from 'next/navigation';

export default function PostEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 수정하고자 하는 포스트의 id
  const postId: number = Number(params.id);

  const {
    data: originalPost,
    isLoading,
    isError,
    error,
  } = useQuery<Post>({
    queryKey: ['postForEdit', postId],
    queryFn: () => getPostForEdit(postId),
    enabled: !!postId,
  });

  // 수정 전 오리지널 데이터 채워놓기
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  useEffect(() => {
    if (originalPost) {
      setTitle(originalPost.title);
      if (originalPost.content) {
        setContent(originalPost.content);
      }
    }
  }, [originalPost]);

  const { mutate: updatePostAction, isPending: isUpdating } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      alert('게시글이 성공적으로 수정되었습니다 !');
      router.push(`/posts/${postId}`);
    },
    onError: (error) => {
      const errorData = error.message;
      alert(`포스트 수정에 실패했습니다 : ${error.message}`);
      throw new Error(`포스트 수정 에러 : ${errorData}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatePostData: UpdatePostData = {
      title: title,
      content: content,
    };
    updatePostAction({ postId, updatePostData });
  };

  // getpost <- useQuery
  if (isLoading) {
    return (
      <div className="text-center p-8">수정할 게시물을 불러오는 중...</div>
    );
  }
  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">오류: {error.message}</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">게시물 수정하기</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isUpdating ? '수정 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  );
}
