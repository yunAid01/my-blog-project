// apps/my-blog-frontend-ver2/src/components/modal/CommentEditModal
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Comment, UpdateCommentData } from '@my-blog/types';
import { X } from 'lucide-react';
import { updateComment } from '@/api/comment';

interface ProfileEditModalProps {
    postId: number;
    comment: Comment
    onClose: () => void;
}
export default function CommentEditModal({ comment, postId ,onClose }: ProfileEditModalProps) {
    const queryClient = useQueryClient();
    const [text, setText] = useState('');

    const { 
        mutate: updateCommentAction,
        isPending: isUpdating
    } = useMutation({
        mutationFn: updateComment,
        onSuccess: () => {
            alert('댓글이 수정되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            onClose();
        },
        onError: (error) => {
            console.error(error);
            alert(`댓글 업데이트 실패: ${error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const commentId = comment.id
        const updateCommentData: UpdateCommentData = {
            text: text
        };
        updateCommentAction({ commentId, postId, updateCommentData });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">댓글 수정</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <label htmlFor="text" className="text-sm font-semibold"></label>
                        <input id="text" type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isUpdating || !text.trim()} className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 disabled:bg-blue-300">
                            {isUpdating ? '저장 중...' : '저장'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}