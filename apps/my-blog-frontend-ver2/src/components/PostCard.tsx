// src/compoenets/PostCard.tsx

// 'use client' 오타를 수정했어요. 'clients'가 아니라 'client'입니다!
'use client';

import type { PostForMainPage } from '@my-blog/types';
import Link from 'next/link';
import LikeButton from './LikeButton';
import CommentForm from './CommentForm';
import React, { useState } from 'react';
import { timeAgo } from '@/lib/time'; // 작성날짜 관련
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import PostConfig from './PostConfig';

interface PostCardProps {
  post: PostForMainPage;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const queryClinet = useQueryClient();
  const { data: loginUser } = useUser();

  // postmenu open

  return (
    // 전체 카드를 감싸는 컨테이너
    // max-w-xl: 최대 너비 지정 (너무 넓어지지 않게)
    // mx-auto: 좌우 여백을 자동으로 맞춰서 가운데 정렬
    // bg-white: 배경색을 흰색으로
    // border border-gray-200: 얇은 회색 테두리 추가
    // rounded-xl: 모서리를 둥글게 (xl 사이즈로)
    // my-4: 위아래 바깥 여백 (margin-top, margin-bottom)
    // shadow-sm: 부드러운 그림자 효과

    <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl my-4 shadow-sm">
      {/* 1. 카드 헤더: 작성자 정보 */}
      <div className="flex items-center p-4">
        {/* 작성자 프로필 이미지 (임시) */}
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>

        {/* 작성자 닉네임 */}
        <div className="ml-3">
          <Link
            href={`/user/${post.author.id}`}
            className="font-bold text-sm text-gray-800 hover:underline"
          >
            {post.author.nickname}
          </Link>
        </div>

        <div className="ml-auto relative">
          {/* 설정창 => 게시글 수정 및 삭제 */}
          <PostConfig postAuthorId={post.author.id} postId={post.id} />
        </div>
      </div>

      {/* 2. 게시물 본문 (이미지가 있다면 여기에 넣으면 좋아요) */}
      {/* 우선 제목과 내용을 표시합니다. */}
      <div className="px-4 pb-4">
        <Link href={`posts/${post.id}`}>
          <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
          <p className="text-gray-700 text-sm">{post.content}</p>
        </Link>
      </div>

      {/* 3. 액션 버튼: 좋아요, 댓글 */}
      <div className="px-4 flex items-center space-x-4">
        {/* 좋아요 버튼 */}
        <LikeButton postId={post.id} postLikes={post.likes} />

        {/* 댓글 버튼 */}
        <Link href={`/posts/${post.id}`}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
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
      <div className="px-4 py-2">
        <p className="font-bold text-sm text-gray-800">
          좋아요 {post.likes.length}개
        </p>
      </div>

      {/* 5. 작성 날짜 */}
      <div className="px-4 pb-2">
        <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
      </div>

      {/* 6. 댓글 섹션 */}
      <div className="px-4 pb-4 border-t border-gray-100 mt-2 pt-2">
        {/* 댓글 개수 보여주기 (옵션) */}
        <Link href={`/posts/${post.id}`}>
          <p className="text-sm text-gray-500 mb-2">
            댓글 {post.comments.length}개 모두 보기
          </p>
        </Link>

        {/* 댓글 작성 폼 */}
        <div className="px-4 pb-3">
          <CommentForm postId={post.id} />
        </div>
      </div>
    </div>
  );
}
