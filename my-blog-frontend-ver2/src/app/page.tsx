//src/app/page.tsx
'use client';

import type { Post } from "@/types";
import { getPosts } from "@/api/posts";
import { useQuery } from '@tanstack/react-query';

// components
import PostForm from '@/components/Postform';

export default function Home() {
  const {
    data: posts, // data의 이름을 posts로 변경
    isLoading,
    isError,
    error,
  } = useQuery<Post[]>({
    queryKey: ['posts'], // 이 데이터의 고유한 키. 이 키로 캐싱됩니다.
    queryFn: getPosts,   // 데이터를 가져올 함수
  });

  if (isLoading) {
    return <div>로딩 중입니다...</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <main>
      <h1>인스타그램 피드</h1>
      <div>
        {posts?.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px' }}>
            <p><strong>{post.author.nickname}</strong></p>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div>
        <PostForm />
      </div>
    </main>
  );
}
