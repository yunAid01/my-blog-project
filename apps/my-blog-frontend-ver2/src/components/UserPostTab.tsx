'use client'
import PostGridItem from "@/components/PostGridItem"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserPosts, getUserLikedPosts, getUserSavedPosts } from "@/api/user"
import { UserTabPost } from "@my-blog/types";


interface UserPostTabProps {
    userId: number
}
export default function UserPostTab ({ userId }: UserPostTabProps) {
    // 현재 탭 상태
    const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'saved'>('posts');

    // tab 쿼리
    const {
        data: tabData,
        isLoading: isTabLoading // ✅ 탭 콘텐츠용 로딩 (posts)
    } = useQuery<UserTabPost[]>({
        // queryKey에 activeTab을 넣어, 탭이 바뀔 때마다 쿼리가 다시 실행되게 합니다.
        queryKey: ['userContent', userId, activeTab],
        queryFn: () => {
            if (activeTab === 'posts') return getUserPosts(userId);
            if (activeTab === 'likes') return getUserLikedPosts(userId);
            if (activeTab === 'saved') return getUserSavedPosts(userId);
            return Promise.resolve([]); // 기본값
        },
        enabled: !!userId
    })

    return (
        <>
            {/* ✅ 3. 탭 메뉴 UI */}
            <div className="border-t border-gray-300">
                <div className="flex justify-center space-x-12">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`py-3 text-sm font-semibold tracking-widest ${
                            activeTab === 'posts'
                            ? 'border-t-2 border-black -mt-px text-gray-800'
                            : 'text-gray-400'
                        }`}
                    >
                        게시물
                    </button>
                    <button
                        onClick={() => setActiveTab('likes')}
                        className={`py-3 text-sm font-semibold tracking-widest ${
                            activeTab === 'likes'
                            ? 'border-t-2 border-black -mt-px text-gray-800'
                            : 'text-gray-400'
                        }`}
                    >
                        좋아요
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`py-3 text-sm font-semibold tracking-widest ${
                            activeTab === 'saved'
                            ? 'border-t-2 border-black -mt-px text-gray-800'
                            : 'text-gray-400'
                        }`}
                    >
                        저장됨 (comming soon)
                    </button>
                </div>
            </div>

            {/* ✅ 4. 게시물 그리드 수정 */}
            <div className="grid grid-cols-3 gap-1 sm:gap-4">
                {isTabLoading ? (
                    <div className="col-span-3 text-center text-gray-500 mt-16">
                        게시물을 불러오는 중...
                    </div>
                ) : tabData && tabData.length > 0 ? (
                    tabData.map(post => (
                        <PostGridItem key={post.id} post={post} />
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-500 mt-16">
                        <h2 className="text-2xl font-bold">아직 게시물이 없습니다</h2>
                    </div>
                )}
            </div>
        </>
    )
}