// src/compoenents/CommentCard.tsx

// 날짜를 '방금 전' 등으로 예쁘게 보여주기 위해 timeAgo 함수를 가져옵니다.
import { timeAgo } from "@/lib/time";
import Link from "next/link";

interface CommentCardProps {
    comment: {
        id: number;
        text: string;
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
    return (
        // flex: 자식 요소들을 가로로 배치
        // items-start: 자식들을 위쪽 기준으로 정렬 (프로필 이미지와 텍스트)
        // space-x-2: 자식 요소들 사이에 약간의 가로 간격 추가
        <div className="flex items-start space-x-2">
            {/* 1. 댓글 작성자 프로필 이미지 (임시) */}
            {/* w-8 h-8: 너비, 높이 지정 */}
            {/* bg-gray-200: 배경색 */}
            {/* rounded-full: 원 모양으로 만듦 */}
            {/* flex-shrink-0: 창이 줄어들어도 이미지가 찌그러지지 않게 함 */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>

            {/* 2. 댓글 내용과 작성자 정보 */}
            <div className="flex-1">
                <p className="text-sm">
                    {/* 작성자 닉네임 */}
                    {/* font-bold: 굵은 글씨 */}
                    {/* mr-2: 오른쪽에 약간의 여백 */}
                    <Link href={`/user/${comment.author.id}`} className="font-bold mr-2 hover:underline">
                        {comment.author.nickname}
                    </Link>

                    {/* 댓글 내용 */}
                    {comment.text}
                </p>
                
                {/* 3. 작성 시간 */}
                {/* text-xs: 아주 작은 글씨 */}
                {/* text-gray-500: 회색 글씨 */}
                {/* mt-1: 위쪽에 약간의 여백 */}
                <p className="text-xs text-gray-500 mt-1">
                    {timeAgo(comment.createdAt)}
                </p>
            </div>
        </div>
    );
}