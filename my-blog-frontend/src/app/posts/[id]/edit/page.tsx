// src/app/posts/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Post } from '@/types';

export default function EditPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const params = useParams(); // 1. URL 파라미터를 가져오는 훅
  const { user } = useAuth();
  const id = params.id as string; // 2. params 객체에서 id 추출

  // 3. 페이지가 로드될 때, 기존 게시글 데이터를 불러와서 폼에 채워 넣습니다.
  useEffect(() => {
    if (!id || !user) return; // id나 user 정보가 없으면 실행하지 않음

    async function fetchPost() {
      const response = await fetch(`http://localhost:3000/posts/${id}`); // data 가져오기
      if (response.ok) {
        const postData: Post = await response.json();
        
        // 4. (중요!) 불러온 데이터의 작성자(authorId)와 로그인한 사용자(user.sub)가 다른지 확인
        if (user!.sub !== postData.authorId) {
          alert('수정 권한이 없습니다.');
          router.back(); // 이전 페이지로 돌려보내기
        } else {
          // 작성자가 맞으면, 폼의 상태를 기존 데이터로 채웁니다.
          setTitle(postData.title);
          setContent(postData.content || '');
        }
      }
    }
    fetchPost();
  }, [id, user, router]); // id나 user 정보가 확정될 때 이 로직을 실행

  // 폼 제출 로직 (글쓰기 페이지와 거의 동일)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt-token');

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'PATCH', // 5. 'PATCH' 메서드로 요청
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) { 
        throw new Error('게시글 수정에 실패했습니다.');
      }

      alert('게시글이 성공적으로 수정되었습니다.');
      router.push(`/posts/${id}`); // 수정된 게시글 상세 페이지로 이동
    } catch (error) {
      alert(error instanceof Error ? error.message : '수정 중 에러 발생');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      {/* 폼 UI는 글쓰기 페이지와 거의 동일합니다. 제목만 바꿔줍니다. */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">게시글 수정하기</h1>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-semibold mb-2">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-8">
          <label htmlFor="content" className="block text-lg font-semibold mb-2">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 h-64 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          수정 완료
        </button>
      </form>
    </main>
  );
}