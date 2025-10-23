'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserForProfile } from '@/api/user';
import { useParams } from 'next/navigation';
import type { UserForProfile } from '@my-blog/types';
import { useUser } from '@/hooks/useUser'; //login
import React from 'react';
import UserConfig from '@/components/UserConfig';
import UserPostTab from '@/components/UserPostTab';

export default function UserPage() {
  const params = useParams();
  const userId: number = Number(params.id); // getUserForProfile
  const { data: loginUser } = useUser();

  // user 쿼리
  const {
    data: userForProfile,
    isLoading: isUserLoading,
    isError,
    error,
  } = useQuery<UserForProfile>({
    queryKey: ['user', userId],
    queryFn: () => getUserForProfile(userId),
    enabled: !!userId,
  });

  // --- 로딩 및 에러 처리 (기존 로직과 동일) ---
  if (isUserLoading) {
    return <div className="text-center mt-20">프로필을 불러오는 중...</div>;
  }
  if (isError) {
    return (
      <div className="text-center mt-20 text-red-500">
        오류 발생: {error?.message}
      </div>
    );
  }
  if (!userForProfile) {
    return <div className="text-center mt-20">존재하지 않는 사용자입니다.</div>;
  }

  // --- UI 렌더링 (반응형 패딩/간격 수정) ---
  return (
    // [REFACTORED]
    // (기본) p-4: 모바일에서 상하좌우 1rem 여백
    // (sm:) sm:py-8: sm 이상에서 상하 여백만 2rem으로 늘림 (좌우는 p-4 유지)
    <main className="container mx-auto max-w-4xl p-4 sm:py-8">
      {/* 프로필 헤더 (기존 반응형 sm:flex-row 유지) */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
        {/* 프로필 이미지 (기존 반응형 sm:w-40 유지) */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 flex-shrink-0">
          {/* 나중에 Image 태그로 실제 유저 프로필 이미지를 넣을 곳입니다. */}
        </div>

        {/* 프로필 정보 (기존 반응형 sm:ml-10, sm:text-left 유지) */}
        <div className="sm:ml-10 mt-4 sm:mt-0 text-center sm:text-left w-full">
          {/* 닉네임과 버튼들 */}
          <UserConfig loginUser={loginUser} userForProfile={userForProfile} />

          {/* [REFACTORED]
            - (기본) space-x-6: 모바일에서 중앙 정렬 시 간격을 1.5rem으로 살짝 줄임
            - (sm:) sm:space-x-8: sm 이상에선 2rem으로 늘림
            - my-4: 상하 마진을 주어 위(버튼), 아래(소개)와 간격 확보
          */}
          <div className="flex justify-center sm:justify-start space-x-6 sm:space-x-8 my-4">
            <div>
              <span className="font-semibold">
                {userForProfile.followers.length}
              </span>{' '}
              팔로워
            </div>
            <div>
              <span className="font-semibold">
                {userForProfile.followings.length}
              </span>{' '}
              팔로잉
            </div>
          </div>

          {/* 사용자 이름/소개 */}
          <div>
            <p className="font-semibold">{userForProfile.nickname}</p>
            <p className="text-sm">
              여기에 사용자 소개글이 표시됩니다. (예: DB에 bio 추가)
            </p>
          </div>
        </div>
      </header>

      {/* user post tab (로직 유지) */}
      <UserPostTab userId={userForProfile.id} />
    </main>
  );
}