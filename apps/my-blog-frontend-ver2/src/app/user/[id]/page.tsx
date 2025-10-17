'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserForProfile } from "@/api/user"
import { useParams } from "next/navigation"
import type { GetUserForProfileReturn } from "@my-blog/types"
import PostGridItem from "@/components/PostGridItem"
import { useUser } from "@/hooks/useUser" //login
import { createFollow, deleteFollow } from "@/api/follow"
import React from "react"

export default function UserPage() {
    const queryClient = useQueryClient()
    const params = useParams();
    const userId = Number(params.id); // getUserForProfile
    const { data: loginUser } = useUser(); 

    // user 쿼리
    const {
        data: userForProfile,
        isLoading,
        isError,
        error
    } = useQuery<GetUserForProfileReturn>({
        queryKey: ['user', userId], // 이 데이터의 고유한 키. 이 키로 캐싱됩니다.
        queryFn: () => getUserForProfile(userId),   // 데이터를 가져올 함수
        enabled: !!userId,
    })

    // follow 쿼리
    const isFollowing = userForProfile?.followers.some(follower => follower.followerId === loginUser?.id)
    const {
        mutate: toggleFollowAction,
        isPending
    } = useMutation({
        mutationFn: isFollowing ? deleteFollow : createFollow,
        onSuccess: () => {
            console.log('fuckyou')
            queryClient.invalidateQueries({ queryKey: ['user', userId]})
        },
        onError: (error) => {
            console.error(`팔로우 기능 에러 : ${error.message}`)
            alert(`에러 발생 : ${error.message}`)
        }
    });
    if (isLoading) {
        return <div className="text-center mt-20">프로필을 불러오는 중...</div>;
    }
    if (isError) {
        return <div className="text-center mt-20 text-red-500">오류 발생: {error?.message}</div>;
    }
    if (!userForProfile) {
        return <div className="text-center mt-20">존재하지 않는 사용자입니다.</div>;
    }
    
    const handleFollowClick = () => {
        toggleFollowAction(userForProfile.id)
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
                    <div className="flex items-center justify-center sm:justify-start space-x-4 mb-4">
                        <h1 className="text-3xl font-light">{userForProfile.nickname}</h1>
                        {/* 로그인한 유저와 프로필 유저가 다를때에만 팔로우를 보여줌 */}
                        {loginUser?.id !== userForProfile.id && (
                            isFollowing ? (
                                <button 
                                    className="bg-blue-200 text-white px-4 py-1.5 rounded-lg font-semibold text-sm"
                                    onClick={handleFollowClick}
                                    disabled={isPending}>
                                    언팔로우
                                </button>
                            ) : (
                                <button 
                                    className="bg-blue-500 text-white px-4 py-1.5 rounded-lg font-semibold text-sm"
                                    onClick={handleFollowClick}
                                    disabled={isPending}
                                >
                                팔로우
                                </button>
                            )
                        )}
                    </div>

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

            {/* 탭 메뉴 */}
            <div className="border-t border-gray-300">
                <div className="flex justify-center space-x-12">
                    <button className="py-3 border-t-2 border-black -mt-px font-semibold text-sm tracking-widest text-gray-800">게시물</button>
                    <button className="py-3 text-sm font-semibold tracking-widest text-gray-400">저장됨</button>
                    <button className="py-3 text-sm font-semibold tracking-widest text-gray-400">태그됨</button>
                </div>
            </div>

            {/* 게시물 그리드 */}
            <div className="grid grid-cols-3 gap-1 sm:gap-4">
                {userForProfile.posts.length > 0 ? (
                    userForProfile.posts.map(post => (
                        <PostGridItem key={post.id} post={post} />
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-500 mt-16">
                        <h2 className="text-2xl font-bold">아직 게시물이 없습니다</h2>
                    </div>
                )}
            </div>
        </main>
    )
}