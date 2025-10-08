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
  }
}


// PostCard 컴포넌트는 'post'라는 이름의 데이터를 props로 받습니다.
export default function PostCard({ post }: PostCardProps) {
  return (
    // 2. Link 컴포넌트로 전체 div를 감싸서 클릭 가능한 링크로 만듭니다.
    //    href 속성으로 각 게시글의 상세 페이지 경로를 동적으로 만들어줍니다.
    <Link href={`/posts/${post.id}`}>
      <div className="p-4 border border-gray-700 rounded-lg mb-4 hover:bg-gray-800 transition-colors cursor-pointer">
        <h2 className="text-2xl font-semibold">{post.title}</h2>
        <p className="text-gray-400 mt-2">{post.content}</p>
      </div>
    </Link>
  );
}


// 들어오는 props
// props = {
//     post: {
//         id: number,
//         title: string,
//         content: string,
//         createdAt:string,
//         updatedAt: string,
//         authorId: number,
//     }
// }