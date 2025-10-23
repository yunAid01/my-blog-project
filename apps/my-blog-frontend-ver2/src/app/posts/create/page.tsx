'use client';

// query
import { createPost } from '@/api/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react'; // 이미지 업로드를 위한 아이콘

export default function PostCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const queryClient = useQueryClient();
  const { mutate: createPostAction, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      alert('게시물이 성공적으로 작성되었습니다!');
      router.push('/');
    },
    onError: (error) => {
      console.error(`포스트 생성 에러 :${error.message}`);
      alert(`포스트 작성에 실패했습니다: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 나중에 FormData를 사용하여 이미지 파일도 함께 전송
    createPostAction({ title, content });
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-8 text-center text-3xl font-bold">새 게시물 만들기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 입력 필드 */}
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
            placeholder="멋진 제목을 입력하세요..."
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            disabled={isPending}
          />
        </div>

        {/* 내용 입력 필드 */}
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
            placeholder="당신의 이야기를 들려주세요..."
            rows={8}
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            disabled={isPending}
          />
        </div>

        {/* TODO: 이미지 업로드 기능 영역 */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            이미지나 동영상을 여기에 끌어다 놓으세요 (구현 예정)
          </p>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || !title || !content}
            className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {isPending ? '업로드 중...' : '게시하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
