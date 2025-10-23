//src/app/page.tsx
'use client';

import type { PostForMainPage } from '@my-blog/types';
import { getPostsForMainPage } from '@/api/posts';
import { useQuery } from '@tanstack/react-query';

// components
import PostCard from '@/components/PostCard';

export default function Home() {
  const {
    data: posts, // data의 이름을 posts로 변경
    isLoading,
    isError,
    error,
  } = useQuery<PostForMainPage[]>({
    queryKey: ['posts'], // 이 데이터의 고유한 키. 이 키로 캐싱됩니다.
    queryFn: getPostsForMainPage, // 데이터를 가져올 함수
  });

  if (isLoading) {
    return <div>로딩 중입니다...</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <main>
      <div>
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
