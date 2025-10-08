// src/app/posts/[id]/page.tsx
'use client'; // 버튼 클릭 등 상호작용이 필요하므로 클라이언트 컴포넌트로 변경

import { useEffect, useState } from 'react';
import type { Post } from "@/types";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const { isLoggedIn, user } = useAuth(); // AuthContext에서 user 정보 가져오기
  const router = useRouter();

  // 클라이언트 컴포넌트에서는 useEffect를 사용해 데이터를 가져옵니다.
  useEffect(() => {
    async function fetchPost() {
      const response = await fetch(`http://localhost:3000/posts/${params.id}`);
      if (response.ok) {
        const postData = await response.json();
        setPost(postData);
      }
    }
    fetchPost();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    const token = localStorage.getItem('jwt-token');
    try {
      const response = await fetch(`http://localhost:3000/posts/${params.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('삭제 권한이 없거나, 서버에 문제가 발생했습니다.');
      }
      
      alert('게시글이 삭제되었습니다.');
      router.push('/posts'); // 목록 페이지로 이동
    } catch (error) {
      alert(error instanceof Error ? error.message : '삭제 중 에러 발생');
    }
  };
  
  // 데이터 로딩 중 표시
  if (!post) {
    return <p className="text-white text-center pt-24">Loading...</p>;
  }

  // 로그인한 사용자가 이 글의 작성자인지 확인
  const isAuthor = isLoggedIn && user?.sub === post.authorId;

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-400 mb-8 border-b border-gray-700 pb-4 flex justify-between items-center">
          <span>Published on {new Date(post.createdAt).toLocaleDateString()}</span>
          {/* 작성자일 경우에만 수정/삭제 버튼을 보여줍니다. */}
          {isAuthor && (
            <div className="flex gap-2">
              <Link href={`/posts/${post.id}/edit`} className="text-sm text-gray-400 hover:text-white transition-colors">
                Edit
              </Link>
              <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-400">
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="prose prose-invert max-w-none text-lg leading-relaxed">
          <p>{post.content || '내용이 없습니다.'}</p>
        </div>
      </div>
    </main>
  );
}