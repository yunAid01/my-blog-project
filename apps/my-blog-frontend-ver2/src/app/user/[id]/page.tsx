'use client'

import { useQuery } from "@tanstack/react-query"
import { getUserForProfile } from "@/api/user"
import { useParams } from "next/navigation"
import type { GetUserForProfileReturn } from "@my-blog/types"
import { useUser } from "@/hooks/useUser" //login
import React from "react"
import UserConfig from "@/components/FollowButton"
import UserPostTab from "@/components/UserPostTab"



export default function UserPage() {
    const params = useParams();
    const userId = Number(params.id); // getUserForProfile
    const { data: loginUser } = useUser();

    

    // user 쿼리
    const {
        data: userForProfile,
        isLoading: isUserLoading, // ✅ 유저 정보 로딩 (user)
        isError,
        error
    } = useQuery<GetUserForProfileReturn>({
        queryKey: ['user', userId], // 이 데이터의 고유한 키. 이 키로 캐싱됩니다.
        queryFn: () => getUserForProfile(userId),   // 데이터를 가져올 함수
        enabled: !!userId,
    })

    if (isUserLoading) {
        return <div className="text-center mt-20">프로필을 불러오는 중...</div>;
    }
    if (isError) {
        return <div className="text-center mt-20 text-red-500">오류 발생: {error?.message}</div>;
    }
    if (!userForProfile) {
        return <div className="text-center mt-20">존재하지 않는 사용자입니다.</div>;
    }
    
    

    return (
        <main className="container mx-auto max-w-4xl py-8 px-4">
            {/* 프로필 헤더 */}
            <header className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
                {/* 프로필 이미지 (크게) */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 flex-shrink-0">
                    {/* 나중에 Image 태그로 실제 유저 프로필 이미지를 넣을 곳입니다. */}
                </div>

                <div className="sm:ml-10 mt-4 sm:mt-0 text-center sm:text-left w-full">
                    {/* 닉네임과 버튼들 */}
                    <UserConfig loginUser={loginUser} userForProfile={userForProfile}/>
                
                    {/* 통계 정보 */}
                    <div className="flex justify-center sm:justify-start space-x-8 mb-4">
                        <div><span className="font-semibold">{userForProfile.posts.length}</span> 게시물</div>
                        <div><span className="font-semibold">{userForProfile.followers.length}</span> 팔로워</div>
                        <div><span className="font-semibold">{userForProfile.followings.length}</span> 팔로잉</div>
                    </div>
                    
                    {/* 사용자 이름/소개 */}
                    <div>
                        <p className="font-semibold">{userForProfile.nickname}</p>
                        <p className="text-sm">여기에 사용자 소개글이 표시됩니다. (예: DB에 bio 추가)</p>
                    </div>
                </div>
            </header>

            {/* user post tab */}
            <UserPostTab userId={userForProfile.id} />
        </main>
    )
}