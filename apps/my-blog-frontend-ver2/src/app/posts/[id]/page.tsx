'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// API 함수들
import { getPostById } from '@/api/posts';

// 컴포넌트들
import CommentCard from '@/components/CommentCard';
import CommentForm from '@/components/CommentForm';
import LikeButton from '@/components/LikeButton';

// 훅과 유틸리티 함수
import { useUser } from '@/hooks/useUser';
import { timeAgo } from '@/lib/time';
import type { GetPostReturn } from '@my-blog/types';
import PostConfig from '@/components/PostConfig';
import { ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  // 1. 게시물 데이터 가져오기
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery<GetPostReturn>({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });

  // 3. 로딩 및 에러 상태 처리
  if (isLoading) {
    return <div className="text-center mt-20">게시물을 불러오는 중...</div>;
  }

  if (isError) {
    return (
      <div className="text-center mt-20 text-red-500">
        오류 발생: {error.message}
      </div>
    );
  }

  if (!post || !post.author) {
    return <div className="text-center mt-20">게시물이 존재하지 않습니다.</div>;
  }

  // 4. 최종 UI 렌더링
  return (
    <main className="py-8">
      <div className="container mx-auto">
        <div className="flex h-[90vh] max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* 왼쪽: 이미지 영역 */}
          <div className="w-1/2 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400">이미지 영역</div>
          </div>

          {/* 오른쪽: 정보 및 댓글 영역 */}
          <div className="w-1/2 flex flex-col">
            {/* 작성자 정보 */}
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

                <div className="ml-3">
                  <Link
                    href={`/user/${post.author.id}`}
                    className="font-bold text-sm hover:underline"
                  >
                    {post.author.nickname}
                  </Link>
                </div>

                <div className="ml-auto flex items-center space-x-4">
                  {/* post config */}
                  <PostConfig postAuthorId={post.author.id} postId={post.id} />

                  <button onClick={() => router.back()}>
                    <ArrowLeft />
                  </button>
                </div>
              </div>
            </div>

            {/* 게시물 내용 및 댓글 목록 (스크롤 가능) */}
            <div className="p-4 flex-grow overflow-y-auto">
              {/* 게시물 본문 */}
              <div className="mb-4">
                <h2 className="font-semibold text-lg">{post.title}</h2>
                <p className="text-gray-700 text-sm">{post.content}</p>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">아직 댓글이 없습니다.</p>
                )}
              </div>
            </div>

            {/* 하단 액션 영역 */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-4">
                <LikeButton postId={post.id} postLikes={post.likes} />
              </div>
              <p className="font-bold text-sm mt-2">
                좋아요 {post.likes.length}개
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {timeAgo(post.createdAt)}
              </p>
            </div>

            {/* 댓글 입력 폼 */}
            <div className="p-4 border-t">
              <CommentForm postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
