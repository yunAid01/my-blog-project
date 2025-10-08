// src/components/PostCard.tsx

import Link from 'next/link'; // 1. Next.js의 Link 컴포넌트를 import 합니다.
import type { Post } from '@/types';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string | null;
    createdAt: string;
    updatedAt: string;
    authorId: number;
    author: {
      id: string;
      email: string;
    }
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="p-4 border border-gray-700 rounded-lg mb-4 hover:bg-gray-800 transition-colors cursor-pointer">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          {/* 3. 이제 author 정보를 사용할 수 있으니, 작성자 이메일을 표시해줍시다. */}
          <span className="text-gray-500 text-sm">
            {/* post.author가 존재할 경우를 대비하여 옵셔널 체이닝(?.)을 사용하면 더 안전합니다. */}
            by {post.author.email || 'Unknown'}
          </span>
        </div>
        <p className="text-gray-400 mt-2 truncate">{post.content}</p>
      </div>
    </Link>
  );
}