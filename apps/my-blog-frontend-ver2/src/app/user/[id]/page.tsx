'use client'

import { useQuery } from "@tanstack/react-query"
import { getUserWithAllData } from "@/api/user"
import { useParams } from "next/navigation"
import type { GetUserWithAllData } from "@/types"
import PostGridItem from "@/components/PostGridItem"

export default function UserPage() {
    const params = useParams();
    const userId = Number(params.id);

    // user 쿼리
    const {
        data: user,
        isLoading,
        isError,
        error
    } = useQuery<GetUserWithAllData>({
        queryKey: ['user', userId], // 이 데이터의 고유한 키. 이 키로 캐싱됩니다.
        queryFn: () => getUserWithAllData(userId),   // 데이터를 가져올 함수
        enabled: !!userId,
    })

    if (isLoading) {
        return <div className="text-center mt-20">프로필을 불러오는 중...</div>;
    }
    if (isError) {
        return <div className="text-center mt-20 text-red-500">오류 발생: {error?.message}</div>;
    }
    if (!user) {
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
                    <div className="flex items-center justify-center sm:justify-start space-x-4 mb-4">
                        <h1 className="text-3xl font-light">{user.nickname}</h1>
                        <button className="bg-blue-500 text-white px-4 py-1.5 rounded-lg font-semibold text-sm">팔로우</button>
                        <button className="bg-gray-200 px-4 py-1.5 rounded-lg font-semibold text-sm">메시지 보내기</button>
                    </div>

                    {/* 통계 정보 */}
                    <div className="flex justify-center sm:justify-start space-x-8 mb-4">
                        <div><span className="font-semibold">{user.posts.length}</span> 게시물</div>
                        <div><span className="font-semibold">{user.followers.length}</span> 팔로워</div>
                        <div><span className="font-semibold">{user.followings.length}</span> 팔로잉</div>
                    </div>
                    
                    {/* 사용자 이름/소개 */}
                    <div>
                        <p className="font-semibold">{user.nickname}</p>
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
                {user.posts.length > 0 ? (
                    user.posts.map(post => (
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