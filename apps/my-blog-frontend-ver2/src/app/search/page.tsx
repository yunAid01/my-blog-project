'use client';

import { getPostsForSearchPage, searchPosts } from "@/api/posts"
import { PostForSearchPage } from "@my-blog/types";
import { useQuery } from "@tanstack/react-query"
import PostGridItem from "@/components/PostGridItem";
import { Link } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

export default function SearchPage() {
    const [inputValue, setInputValue] = useState("");
    const [isKeywordConfirm, setIsKeywordConfirm] = useState("");

    // 키워드 제출 안했을때
    const {
        data: explorePosts,
        isLoading: isLoadingExplore,
        isError: isExplorePostsError,
        error: exploreError
    } = useQuery<PostForSearchPage[]>({
        queryFn: getPostsForSearchPage,
        queryKey: ['postForSearchPage'],
        enabled: !isKeywordConfirm // 미제출
    })

    // 키워도 제출 했을 때
    const {
        data: searchResults,
        isLoading: isLoadingSearch,
        isError: isSearchError,
        error: searchError
    } = useQuery<PostForSearchPage[]>({
        queryFn: () => searchPosts(isKeywordConfirm),
        queryKey: ['searchPosts', isKeywordConfirm],
        enabled: !!isKeywordConfirm, // 제출
    })
    // 제출함수
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 페이지가 새로고침되는 것을 방지
    setIsKeywordConfirm(inputValue); // input에 있던 값을 '확정된 검색어'로 설정
    };
    
    const posts = isKeywordConfirm ? searchResults : explorePosts;
    const isLoading = isKeywordConfirm ? isLoadingSearch : isLoadingExplore;
    const isError = isKeywordConfirm ? isSearchError : isExplorePostsError;
    const error = isKeywordConfirm ? searchError : exploreError

    if(isLoading) {
        return <div>로딩중</div> // ✅ return 추가!
    }

    if(isError) {
    // ✅ return 추가! 그리고 'error' 변수를 { }로 감싸기
        return <div>에러 : {error?.message || '알 수 없는 에러'}</div> 
    }

    // --- 핀터레스트 스타일 렌더링 ---
  return (
    <>
        {/* ========== ⬇️ 검색 UI (Form 태그 활용) ⬇️ ========== */}
        <form onSubmit={handleSubmit} className="mb-8">
            <h1 className="text-3xl font-bold mb-6 px-2">
            {isKeywordConfirm ? `'${isKeywordConfirm}' 검색 결과` : '둘러보기'}
            </h1>
            
            {/* --- ⬇️ 작게 수정한 UI ⬇️ --- */}
            {/* flex를 사용해 input과 button을 한 줄에 배치합니다. */}
            <div className="flex gap-2 items-center">
            
            {/* 1. Input wrapper (for icon) */}
            <div className="relative flex-grow"> {/* flex-grow로 남는 공간 모두 차지 */}
                {/* 돋보기 아이콘 */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                    className="h-5 w-5 text-zinc-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                    />
                </svg>
                </div>
                {/* 검색 입력 필드 (py-2, rounded-md, sm:text-sm) */}
                <input
                type="text"
                placeholder="검색..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-md leading-5 bg-white dark:bg-zinc-800 dark:border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
            </div>

            {/* 2. Small submit button (py-2, text-sm) */}
            <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-md bg-sky-500 text-white font-semibold text-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50"
            >
                검색
            </button>
            </div>
            {/* --- ⬆️ UI 끝 ⬆️ --- */}
        </form>
      {/* ========== ⬆️ 검색 UI 끝 ⬆️ ========== */}
        <div className="p-4 max-w-7xl mx-auto">

        {/* [핵심] Masonry 레이아웃 컨테이너입니다.
            - `columns-2 md:columns-3 ...`: 화면 크기별로 컬럼(열) 개수를 지정합니다.
            - `gap-4`: 컬럼 사이의 간격을 줍니다.
        */}
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4">
            {posts?.map((post) => (
            /*
                [핵심] 각 아이템(Post) 설정입니다.
                - `break-inside-avoid`: 아이템이 컬럼 사이에서 잘리는 것을 방지합니다. (필수)
                - `mb-4`: 아이템 간의 수직(세로) 간격을 줍니다.
            */
            <div key={post.id} className="break-inside-avoid mb-4">
                {/* 2. 기존 <div> 대신 PostGridItem 컴포넌트를 사용합니다. */}
                <PostGridItem post={post} />
            </div>
            ))}
        </div>
        </div>
    </>
    );
} 