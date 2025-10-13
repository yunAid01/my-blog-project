// src/app/posts/page.tsx
import PostCard from "@/components/PostCard";

// API 응답으로 받을 게시글 데이터의 타입을 정의합니다.
// 백엔드의 Prisma 모델과 일치시키는 것이 좋습니다.
import type { Post } from "@/types"; // <--- 이 부분!

   // 백엔드 API로부터 모든 게시글을 가져오는 함수
async function getAllPosts() {
  // 백엔드 서버의 /posts 엔드포인트에 GET 요청을 보냅니다.
  const response = await fetch('http://localhost:3000/posts');
  console.log(response); // response 확인
  if (!response.ok) {
    console.error(response); // 에러 확인
    throw new Error('Failed to fetch data');
  }
  // 응답 데이터를 JSON 형태로 파싱하여 반환합니다.
  return response.json();
}


// 페이지 컴포넌트를 async 함수로 변경합니다.
export default async function PostsPage() {

  // getPosts 함수를 호출하고, 반환된 게시글 목록을 posts 변수에 저장합니다.
  const posts: Post[] = await getAllPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <h1 className="text-5xl font-bold">전체 게시글 목록</h1>
      <p className="mt-4 text-lg">언제나 긍정적이게, 그리고 한번 하는거면 진짜 후회하지 않게</p>
    
      <div className="mt-8 w-full max-w-2xl">
        {/* 2. 복잡한 div 대신 PostCard 컴포넌트를 사용하고, post 데이터를 prop으로 전달합니다. */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}