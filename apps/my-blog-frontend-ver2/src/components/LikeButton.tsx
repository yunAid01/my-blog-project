// src/compoenets/LikeButton.tsx
'use client';

import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { createLike, deleteLike } from '@/api/like';
import { useUser } from '@/hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  postId: number;
  postLikes: {
    userId: number;
    postId: number;
  }[];
}

export default function LikeButton({ postId, postLikes }: LikeButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: loginUser } = useUser(); //login user 확인

  const isLiked = postLikes.some((like) => like.userId === loginUser?.id);
  const { mutate: toggleLikeAction, isPending } = useMutation({
    mutationFn: isLiked ? deleteLike : createLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error(`에러 발생${error}`);
      alert(`좋아요 에러 발생 : ${error?.message}`);
    },
  });

  // handlel
  const handleToggleLike = () => {
    if (!loginUser) {
      alert('로그인이 필요합니다..');
      router.push('/login');
    }
    toggleLikeAction(postId);
  };

  return (
    <>
      <button onClick={handleToggleLike} disabled={isPending}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          // 1. className을 isLiked 값에 따라 동적으로 변경합니다.
          className={`h-6 w-6 transition ${
            isLiked
              ? 'text-red-500' // isLiked가 true이면, 하트 색을 빨간색으로
              : 'text-gray-700 hover:text-red-500' // false이면, 회색(마우스 올리면 빨간색)으로
          }`}
          // 2. fill 속성도 isLiked 값에 따라 동적으로 변경합니다.
          fill={isLiked ? 'currentColor' : 'none'} // isLiked가 true이면, 내부를 현재 색(빨간색)으로 채웁니다.
          viewBox="0 0 24 24"
          stroke="currentColor" // stroke 색상은 className의 text 색상을 따라갑니다.
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.672l1.318-1.354a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
          />
        </svg>
      </button>
    </>
  );
}
