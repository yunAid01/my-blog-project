'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// API 함수들
import { getPostById } from '@/api/posts';
import { createLike, deleteLike } from '@/api/like';

// 컴포넌트들
import CommentCard from '@/components/CommentCard';
import CommentForm from '@/components/CommentForm';

// 훅과 유틸리티 함수
import { useUser } from '@/hooks/useUser';
import { timeAgo } from '@/lib/time';
import type { Post } from '@/types';


export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const postId = Number(params.id);

    const { data: user } = useUser();

    // 1. 게시물 데이터 가져오기
    const { 
        data: post, 
        isLoading, 
        isError, 
        error 
    } = useQuery<Post>({
        queryKey: ['post', postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId,
    });
    
    // 이 페이지 내부에서만 사용할 상태와 로직들
    const isLiked = post?.likes.some((like) => like.userId === user?.id);
    
    // 2. 좋아요 기능 로직
    const { mutate: toggleLikeAction, isPending: isLikePending } = useMutation({
        mutationFn: isLiked ? deleteLike : createLike,
        onSuccess: () => {
            // 성공 시, 'post' 데이터와 'posts' 목록 데이터 모두를 최신화하라고 알려줍니다.
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },  
        onError: (error) => {
            alert(`에러: ${error.message}`);
        },
    });

    const handleLikeClick = () => {
        if (!user) {
            alert("로그인이 필요합니다.");
            router.push('/login');
            return;
        }
        toggleLikeAction(postId);
    };

    // 3. 로딩 및 에러 상태 처리
    if (isLoading) {
        return <div className="text-center mt-20">게시물을 불러오는 중...</div>;
    }

    if (isError) {
        return <div className="text-center mt-20 text-red-500">오류 발생: {error.message}</div>;
    }

    if (!post) {
        return <div className="text-center mt-20">게시물이 존재하지 않습니다.</div>;
    }

    // 4. 최종 UI 렌더링
    return (
        <main className="py-8">
            <div className="container mx-auto">
                <div className="flex h-[90vh] max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* 왼쪽: 이미지 영역 */}
                    <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                        <div className="text-gray-400">이미지 영역</div>
                    </div>

                    {/* 오른쪽: 정보 및 댓글 영역 */}
                    <div className="w-1/2 flex flex-col">
                        {/* 작성자 정보 */}
                        <div className="p-4 border-b">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="ml-3">
                                    <Link href={`/user/${post.author.id}`} className="font-bold text-sm hover:underline">
                                        {post.author.nickname}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 게시물 내용 및 댓글 목록 (스크롤 가능) */}
                        <div className="p-4 flex-grow overflow-y-auto">
                            {/* 게시물 본문 */}
                            <div className="mb-4">
                                <h2 className="font-semibold text-lg">{post.title}</h2>
                                <p className="text-gray-700 text-sm">{post.content}</p>
                            </div>
                            
                            {/* 댓글 목록 */}
                            <div className="space-y-4">
                                {post.comments.length > 0 ? (
                                    post.comments.map((comment) => (
                                        <CommentCard key={comment.id} comment={comment} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">아직 댓글이 없습니다.</p>
                                )}
                            </div>
                        </div>

                        {/* 하단 액션 영역 */}
                        <div className="p-4 border-t">
                            <div className="flex items-center space-x-4">
                                <button onClick={handleLikeClick} disabled={isLikePending}>
                                    <svg className={`h-6 w-6 transition ${isLiked ? "text-red-500" : "text-gray-700 hover:text-red-500"}`} fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.672l1.318-1.354a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                    </svg>
                                </button>
                                {/* 다른 아이콘 추가 가능 */}
                            </div>
                            <p className="font-bold text-sm mt-2">좋아요 {post.likes.length}개</p>
                            <p className="text-xs text-gray-500 mt-1">{timeAgo(post.createdAt)}</p>
                        </div>
                        
                        {/* 댓글 입력 폼 */}
                        <div className="p-4 border-t">
                            <CommentForm postId={post.id} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}