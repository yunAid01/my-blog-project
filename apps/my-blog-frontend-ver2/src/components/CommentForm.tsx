'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/api/comment';
import { useState } from 'react';

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  const { mutate: createCommentAction, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      console.log(`댓글 작성완료: ${data}`);
      // ✅ 1. 상세 페이지의 데이터를 무효화합니다.
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      // ✅ 2. 메인 페이지의 전체 게시물 목록 데이터도 무효화합니다.
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setText('');
    },
    onError: (error) => {
      alert(`댓글 작성 실패: ${error.message}`);
      setText('');
      throw new Error(`댓글 작성 오류 : ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createCommentData = {
      text: text,
    };
    createCommentAction({ postId, createCommentData });
  };

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 border-t border-gray-100 pt-3 mt-3"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="댓글 달기..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            disabled={isPending}
          />
          <button
            type="submit"
            // !comment.trim() => 댓글 작성을 하지 않았다면 => disabled
            disabled={isPending || !text.trim()}
            className="text-indigo-500 font-semibold text-sm disabled:text-gray-300"
          >
            게시
          </button>
        </form>
      </div>
    </>
  );
}
