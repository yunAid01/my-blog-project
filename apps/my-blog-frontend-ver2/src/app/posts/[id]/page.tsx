// src/app/posts/[id]/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPostById } from '@/api/posts';
import CommentCard from '@/components/CommentCard';
import CommentForm from '@/components/CommentForm';
import LikeButton from '@/components/LikeButton';
import { useUser } from '@/hooks/useUser';
import { timeAgo } from '@/lib/time';
import type { GetPostReturn } from '@my-blog/types';
import PostConfig from '@/components/PostConfig';
import { ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

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

  // --- 로딩 및 에러 처리 (동일) ---
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

  // --- 4. 최종 UI 렌더링 (수정됨) ---
  return (
    // [REFACTORED]
    // - 모바일에서는 패딩 없이, 데스크탑(lg)에서만 py-8 적용
    <main className="lg:py-8">
      {/* [REFACTORED]
        - (기본) flex-col: 모바일에서는 세로로 쌓임
        - (lg) lg:flex-row: 데스크탑에서 가로로 배치
        - (lg) lg:h-[90vh], lg:border, lg:rounded-lg, lg:overflow-hidden:
             데스크탑에서만 모달과 같은 스타일 적용
      */}
      <div className="max-w-5xl mx-auto bg-white flex flex-col lg:flex-row lg:h-[90vh] lg:border lg:border-gray-200 lg:rounded-lg lg:overflow-hidden">
        {/* [REFACTORED]
          - (기본) w-full, aspect-square: 모바일에서 1:1 비율의 꽉 찬 이미지 영역
          - (lg) lg:w-1/2, lg:aspect-auto: 데스크탑에서 1/2 너비 및 자동 높이
        */}
        <div className="w-full lg:w-1/2 bg-gray-100 flex items-center justify-center aspect-square lg:aspect-auto">
          <div className="text-gray-400">이미지 영역</div>
        </div>

        {/* [REFACTORED]
          - (기본) w-full: 모바일에서 꽉 찬 너비
          - (lg) lg:w-1/2, lg:h-full: 데스크탑에서 1/2 너비 및 부모 높이(90vh) 꽉 채움
          - flex-col 구조는 스크롤 영역을 위해 유지
        */}
        <div className="w-full lg:w-1/2 flex flex-col lg:h-full">
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
                <PostConfig postAuthorId={post.author.id} postId={post.id} />
                <button onClick={() => router.back()}>
                  <ArrowLeft />
                </button>
              </div>
            </div>
          </div>

          {/* 게시물 내용 및 댓글 목록 (스크롤) 
            [REFACTORED] - flex-grow overflow-y-auto
            - 데스크탑: 남는 공간을 채우고(flex-grow) 스크롤(overflow-y-auto)
            - 모바일: flex-grow가 콘텐츠 만큼 영역을 차지하고, 스크롤은 페이지 전체 스크롤을 따름
          */}
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
    </main>
  );
}