// src/components/CommentCard.tsx

import { useUser } from '@/hooks/useUser';
import { timeAgo } from '@/lib/time';
import Link from 'next/link';
import CommentConfig from './CommentConfig';

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
    };
  };
}
export default function CommentCard({ comment }: CommentCardProps) {
  const { data: userLogin } = useUser();
  const isMyComment = comment.author.id === userLogin?.id;

  return (
    // [REFACTORED] space-x-2 -> space-x-3 (프로필과 내용 사이 간격 살짝 넓힘)
    <div className="flex items-start space-x-3">
      {/* 1. 댓글 작성자 프로필 이미지 */}
      <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>

      {/* 2. 댓글 내용과 작성자 정보 (구조 변경) */}
      <div className="flex-1">
        {/* [REFACTORED]
          - 텍스트 영역(닉네임, 본문, 시간)과 Config 버튼을 좌우로 분리
        */}
        <div className="flex justify-between items-start">
          {/* 2-1. 텍스트 영역 (왼쪽) */}
          <div>
            {/* [REFACTORED]
              - 닉네임과 댓글 본문을 하나의 <p> 태그 안에 넣어 자연스럽게 연결
            */}
            <p className="text-sm">
              <Link
                href={`/user/${comment.author.id}`}
                className="font-bold mr-1.5 hover:underline"
              >
                {comment.author.nickname}
              </Link>
              <span>{comment.text}</span>
            </p>

            {/* 2-2. 작성 시간 (텍스트 영역 하단) */}
            <p className="text-xs text-gray-500 mt-1">
              {timeAgo(comment.createdAt)}
            </p>
          </div>

          {/* 2-3. CommentConfig (오른쪽) */}
          {/* [REFACTORED] flex-shrink-0, ml-2: 버튼이 찌그러지지 않고, 텍스트와 최소 간격 유지 */}
          <div className="flex-shrink-0 ml-2">
            <CommentConfig
              postId={comment.postId}
              commentAuthorId={comment.authorId}
              comment={comment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}