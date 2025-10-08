// src/app/page.tsx

import PostCard from "@/components/PostCard";
import type { Post } from "@/types";
import Link from 'next/link';

// 모든 게시글을 가져오는 함수
async function getPosts() {
  const response = await fetch('http://localhost:3000/posts', {
    // 1. 캐시를 사용하지 않도록 설정합니다. (홈페이지는 항상 최신 글을 보여줘야 하므로)
    cache: 'no-store', 
  });
  if (!response.ok) {
    // 실제 서비스에서는 에러 처리를 더 정교하게 해야 합니다.
    console.error("Failed to fetch posts");
    return []; // 에러 발생 시 빈 배열 반환
  }
  return response.json();
}

export default async function Home() {
  const allPosts: Post[] = await getPosts();

  // 2. 최신 글이 위로 오도록 정렬하고(내림차순), 최대 3개까지만 잘라냅니다.
  const recentPosts = allPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-900 text-white">
      
      {/* --- 1. 환영 메시지 섹션 (Hero Section) --- */}
      <section className="text-center mb-16 w-full">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Welcome to My Dev Blog
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          기술과 성장에 대한 이야기를 기록합니다. 풀스택 개발자가 되기 위한 여정에 함께하세요.
        </p>
        <Link href="/posts">
          <button className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
            모든 게시글 보기
          </button>
        </Link>
      </section>

      {/* --- 2. 최신 글 목록 섹션 (Recent Posts) --- */}
      <section className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold border-b border-gray-700 pb-2 mb-8">
          최신 글 (Recent Posts)
        </h2>
        <div className="flex flex-col gap-4">
          {recentPosts.length > 0 ? (
            // 3. 잘라낸 최신 글 3개를 PostCard 컴포넌트를 재사용하여 렌더링합니다.
            recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">아직 작성된 글이 없습니다. 첫 글을 작성해보세요!</p>
          )}
        </div>
      </section>

    </main>
  );
}