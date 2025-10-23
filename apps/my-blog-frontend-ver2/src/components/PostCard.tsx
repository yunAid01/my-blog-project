// src/compoenents/PostCard.tsx
'use client';

import type { PostForMainPage } from '@my-blog/types';
import Link from 'next/link';
import LikeButton from './LikeButton';
import CommentForm from './CommentForm';
import React from 'react';
import { timeAgo } from '@/lib/time';
import { useUser } from '@/hooks/useUser';
import PostConfig from './PostConfig';

interface PostCardProps {
  post: PostForMainPage;
}

export default function PostCard({ post }: PostCardProps) {
  const { data: loginUser } = useUser();

  return (
    // [REFACTORED]
    // (기본) w-full, border-y (모바일: 꽉 찬 화면, 위아래 테두리)
    // (sm:) sm:max-w-xl, sm:mx-auto, sm:rounded-xl, sm:border, sm:shadow-sm (데스크탑: 기존 카드 스타일)
    <div className="w-full bg-white border-y border-gray-200 my-4 sm:max-w-xl sm:mx-auto sm:rounded-xl sm:border sm:shadow-sm">
      {/* 1. 카드 헤더: 작성자 정보 */}
      {/* [REFACTORED] p-4 -> p-3 sm:p-4 */}
      <div className="flex items-center p-3 sm:p-4">
        {/* [REFACTORED] w-10 h-10 -> w-8 h-8 sm:w-10 sm:h-10 */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex-shrink-0"></div>

        {/* [REFACTORED] ml-3 -> ml-2 sm:ml-3 */}
        <div className="ml-2 sm:ml-3">
          <Link
            href={`/user/${post.author.id}`}
            // [REFACTORED] text-sm -> text-xs sm:text-sm
            className="font-bold text-xs sm:text-sm text-gray-800 hover:underline"
          >
            {post.author.nickname}
          </Link>
        </div>

        <div className="ml-auto relative">
          <PostConfig postAuthorId={post.author.id} postId={post.id} />
        </div>
      </div>

      {/* 2. 게시물 본문 */}
      {/* [REFACTORED] px-4 pb-4 -> px-3 sm:px-4 pb-3 sm:pb-4 */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <Link href={`posts/${post.id}`}>
          {/* [REFACTORED] text-lg -> text-base sm:text-lg */}
          <h2 className="font-semibold text-base sm:text-lg mb-2">
            {post.title}
          </h2>
          {/* [REFACTORED] text-sm -> text-xs sm:text-sm */}
          <p className="text-gray-700 text-xs sm:text-sm">{post.content}</p>
        </Link>
      </div>

      {/* 3. 액션 버튼: 좋아요, 댓글 */}
      {/* [REFACTORED] px-4 space-x-4 -> px-3 sm:px-4 space-x-3 sm:space-x-4 */}
      <div className="px-3 sm:px-4 flex items-center space-x-3 sm:space-x-4">
        <LikeButton postId={post.id} postLikes={post.likes} />
        <Link href={`/posts/${post.id}`}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              // [REFACTORED] h-6 w-6 -> h-5 w-5 sm:h-6 sm:w-6
              className="h-5 w-5 sm:h-6 sm:h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* 4. 좋아요 개수 */}
      {/* [REFACTORED] px-4 -> px-3 sm:px-4 */}
      <div className="px-3 sm:px-4 py-2">
        {/* [REFACTORED] text-sm -> text-xs sm:text-sm */}
        <p className="font-bold text-xs sm:text-sm text-gray-800">
          좋아요 {post.likes.length}개
        </p>
      </div>

      {/* 5. 작성 날짜 */}
      {/* [REFACTORED] px-4 pb-2 -> px-3 sm:px-4 pb-2 */}
      <div className="px-3 sm:px-4 pb-2">
        {/* [REFACTORED] text-xs -> text-[10px] sm:text-xs (모바일에서 더 작게) */}
        <p className="text-[10px] sm:text-xs text-gray-500">
          {timeAgo(post.createdAt)}
        </p>
      </div>

      {/* 6. 댓글 섹션 */}
      {/* [REFACTORED] px-4 pb-4 -> px-3 sm:px-4 pb-3 sm:pb-4 */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100 mt-2 pt-2">
        <Link href={`/posts/${post.id}`}>
          {/* [REFACTORED] text-sm -> text-xs sm:text-sm */}
          <p className="text-xs sm:text-sm text-gray-500 mb-2">
            댓글 {post.comments.length}개 모두 보기
          </p>
        </Link>

        {/* [REFACTORED] 
          이중 패딩(부모 px-4, 자식 px-4)이 적용되고 있어 자식의 패딩을 제거했습니다. 
          이제 부모의 반응형 패딩(px-3 sm:px-4)을 따라갑니다.
        */}
        <div className="">
          <CommentForm postId={post.id} />
        </div>
      </div>
    </div>
  );
}