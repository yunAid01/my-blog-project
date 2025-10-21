// src/compoenents/CommentCard.tsx

// 날짜를 '방금 전' 등으로 예쁘게 보여주기 위해 timeAgo 함수를 가져옵니다.
import { useUser } from "@/hooks/useUser";
import { timeAgo } from "@/lib/time";
import Link from "next/link";
import CommentConfig from "./CommentConfig";

interface CommentCardProps {
    comment: {
        id: number;
        text: string;
        postId: number;
        authorId: number;
        createdAt: string;
        updatedAt: string;
        author: {
            id: number;
            nickname: string;
            email: string;
        }
    }
}
export default function CommentCard({ comment }: CommentCardProps) {
    const { data: userLogin } = useUser();
    const isMyComment = comment.author.id === userLogin?.id;

    return (
        <div className="flex items-start space-x-2">
            {/* 1. 댓글 작성자 프로필 이미지 (동일) */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>

            {/* 2. 댓글 내용과 작성자 정보 (수정됨) */}
            <div className="flex-1">
                {/* 2-1. 상단 영역: 닉네임과 CommentConfig를 양쪽 끝으로 분리 */}
                {/* flex, justify-between, items-start 추가 */}
                <div className="flex justify-between items-start">
                
                    {/* 닉네임 (왼쪽) */}
                    <Link href={`/user/${comment.author.id}`} className="font-bold text-sm mr-2 hover:underline">
                        {comment.author.nickname} 
                    </Link>

                    {/* CommentConfig (오른쪽) */}
                    {/* flex-shrink-0: 창이 줄어도 찌그러지지 않게 함 */}
                    <div className="flex-shrink-0">

                        {/* comment config compoenent */}
                        <CommentConfig postId={comment.postId} commentAuthorId={comment.authorId} comment={comment} />
                    </div>
                </div>

                {/* 2-2. 댓글 본문 (별도 p 태그로 분리) */}
                {/* 닉네임/아이콘 아랫줄에 표시되도록 mt-1 추가 */}
                <p className="text-sm mt-1">
                    {comment.text}
                </p>
            
                {/* 3. 작성 시간 (동일) */}
                <p className="text-xs text-gray-500 mt-1">
                    {timeAgo(comment.createdAt)}
                </p>
            </div>
        </div>
    );
}