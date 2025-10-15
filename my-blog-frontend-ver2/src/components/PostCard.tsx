// src/compoenets/PostCard.tsx

// 'use client' 오타를 수정했어요. 'clients'가 아니라 'client'입니다!
'use client'; 

import type { Post } from "@/types";
import CommentCard from "./CommentCard";
import Link from "next/link";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";
import { useState } from "react";
interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {

    const [isCommentOpen, setIsCommentOpen] = useState(false);
    // 3. 댓글 아이콘을 클릭했을 때 실행될 함수
    const handleToggleComment = () => {
        // 현재 상태의 반대 값으로 상태를 변경합니다.
        // (false -> true, true -> false)
        setIsCommentOpen(!isCommentOpen);
    };


    // 날짜를 '5시간 전', '2일 전' 처럼 예쁘게 보여주기 위한 간단한 함수
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "년 전";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "달 전";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "일 전";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "시간 전";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "분 전";
        return Math.floor(seconds) + "초 전";
    };

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
                    <Link href={`/user/${post.author.id}`} className="font-bold text-sm text-gray-800 hover:underline">
                        {post.author.nickname}
                    </Link>
                </div>
                
                {/* 더보기 버튼 (오른쪽 끝으로) */}
                <button className="ml-auto text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>

            {/* 2. 게시물 본문 (이미지가 있다면 여기에 넣으면 좋아요) */}
            {/* 우선 제목과 내용을 표시합니다. */}
            <div className="px-4 pb-4">
                <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
                <p className="text-gray-700 text-sm">{post.content}</p>
            </div>
            
            {/* 3. 액션 버튼: 좋아요, 댓글 */}
            <div className="px-4 flex items-center space-x-4">
                {/* 좋아요 버튼 */}
                <LikeButton postId={post.id} initialLikesCount={post.likes.length} />
                
                {/* 댓글 버튼 */}
                {/* 댓글 창을 열고 닫을 '댓글' 아이콘 버튼 */}
                <button onClick={handleToggleComment}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>

            {/* 4. 좋아요 개수 */}
            <div className="px-4 py-2">
                <p className="font-bold text-sm text-gray-800">
                    좋아요 {post.likes.length}개
                </p>
            </div>
            
            {/* 5. 작성 날짜 */}
            <div className="px-4 pb-2">
                <p className="text-xs text-gray-500">
                    {timeAgo(post.createdAt)}
                </p>
            </div>

            {/* 6. 댓글 섹션 */}
            <div className="px-4 pb-4 border-t border-gray-100 mt-2 pt-2">
                {/* 댓글 작성 폼을 보여줄지 말지 결정하는 곳 */}
                <div className="px-4 pb-3">
                     {/* isCommentOpen 상태가 true일 때만 CommentForm을 렌더링(보여주기)합니다. */}
                    {isCommentOpen && <CommentForm postId={post.id} />}
                </div>

                {/* 댓글 개수 보여주기 (옵션) */}
                <p className="text-sm text-gray-500 mb-2">
                    댓글 {post.comments.length}개 모두 보기
                </p>

                {/* 댓글 목록 */}
                <div className="space-y-2">
                    {post.comments && post.comments.length > 0 && 
                        post.comments.slice(0, 2).map((comment) => ( // 예시로 최근 2개만 보여주기
                            <CommentCard key={comment.id} comment={comment} />
                        ))}
                </div>
            </div>
        </div>
    );
}