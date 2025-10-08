// src/app/posts/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const { isLoggedIn } = useAuth(); // 1. AuthContext에서 로그인 상태를 가져옵니다.

  // 2. 페이지 접근 제어 (Route Guarding)
  // useEffect를 사용해, 컴포넌트가 렌더링될 때 로그인 상태를 확인합니다.
  useEffect(() => {
    // isLoggedIn 상태가 확정되고, 그 값이 false라면 (로그인하지 않았다면)
    if (isLoggedIn === false) {
      alert('로그인이 필요합니다.');
      // 로그인 페이지로 강제 이동시킵니다.
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 3. localStorage에서 JWT 토큰을 가져옵니다.
    const token = localStorage.getItem('jwt-token');
    if (!token) {
      alert('로그인 토큰이 없습니다. 다시 로그인해주세요.');
      router.push('/login');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 4. Authorization 헤더에 Bearer 토큰을 추가합니다.
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '게시글 생성에 실패했습니다.');
      }
      
      const newPost = await response.json();
      alert('게시글이 성공적으로 생성되었습니다!');
      // 5. 성공 후, 새로 만들어진 게시글의 상세 페이지로 이동합니다.
      router.push(`/posts/${newPost.id}`);

    } catch (error) {
      console.error('게시글 생성 중 에러:', error);
      alert(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.');
    }
  };
  
  // 로그인 상태가 아직 확인되지 않았거나, 로그아웃 상태라면 로딩 메시지를 표시합니다.
  if (!isLoggedIn) {
    return <p className="text-white text-center pt-24">Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">새 글 작성하기</h1>
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
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          작성 완료
        </button>
      </form>
    </main>
  );
}