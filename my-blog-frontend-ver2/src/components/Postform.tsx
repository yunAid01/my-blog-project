// src/components/PostForm.tsx
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/api/posts';
import type { Post, CreatePostDto } from '@/types';

export default function PostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 1. 쿼리 클라이언트 가져오기
    // 리액트 쿼리의 캐시데이터에 접근
    const queryClient = useQueryClient();

  // 2. useMutation 훅 사용
    const { mutate, isPending } = useMutation({
    mutationFn: createPost, // 데이터를 변경할 때 사용할 함수
    onSuccess: () => {
        console.log('게시물 생성 성공!');
        // 'posts' 쿼리를 무효화하여 최신 데이터를 다시 불러오게 함
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        // 폼 초기화
        setTitle('');
        setContent('');
        },
    onError: (error) => {
        console.error('게시물 생성 실패:', error);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newPost: CreatePostDto = {
            title,
            content,
        };
        // 4. mutate 함수 호출로 API 요청 실행
        mutate(newPost);
    };

    return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid black', padding: '1rem', marginBottom: '1rem' }}>
      <h3>새 게시물 작성</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        required
      />
      <br />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        required
      />
      <br />
      <button type="submit" disabled={isPending}>
        {isPending ? '작성 중...' : '작성하기'}
      </button>
    </form>
  );
}