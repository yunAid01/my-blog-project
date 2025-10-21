'use client'

import { useState } from "react"
import { useUser } from "@/hooks/useUser"
import { useMutation } from "@tanstack/react-query"
import { deleteComment } from "@/api/comment"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from 'next/navigation';
import { Edit, MoreVertical, Trash2 } from "lucide-react"

// modal
import CommentEditModal from "./Modal/CommentEditModal"
import { Comment } from "@my-blog/types"

interface CommentConfigProps {
    postId: number;
    commentAuthorId: number;
    comment: Comment;
}
export default function CommentConfig ({ commentAuthorId, comment, postId }: CommentConfigProps) {
    const { data: loginUser } = useUser(); 
    const queryClient = useQueryClient();
    const isMyComment = commentAuthorId === loginUser?.id;

    // 댓글 config 및 모달 오픈
    const [isCommentCardMemuOpen, setIsCommentCardMemuOpen] = useState(false);
    const [isCommentEditModalOpen, setIsCommentEditModalOpen] = useState(false);

    const {
        mutate: deleteCommentAction,
        isPending: isDeleting
    } = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            alert('댓글이 삭제되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['posts']})
            queryClient.invalidateQueries({ queryKey: ['post', postId]})
        },
        onError: (error) => {
            console.error(`삭제 에러 : ${error}`)
            throw new Error(`삭제 에러 : ${error}`)
        }
    })

    /** comment delete */
    const handleCommentDelete = () => {
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            const commentId = comment.id
            deleteCommentAction({ postId, commentId });
        }
        setIsCommentCardMemuOpen(false); // 메뉴 닫기
    }

    /** comment update click */
    const handleCommentEdit = () => {
        // update comment modal => 컴포넌트 만들어야 함
        setIsCommentEditModalOpen(true); // 모달 열기
        setIsCommentCardMemuOpen(false); // 메뉴 닫기
    }

    return (
        <div>
            {/* 점 세 개 아이콘 버튼 */}
            <button 
                onClick={() => setIsCommentCardMemuOpen(!isCommentCardMemuOpen)}                             className="p-2 rounded-full hover:bg-gray-100"
            >
                <MoreVertical size={20} />
            </button>
            
            {/* 메뉴가 열렸을 때 보여줄 드롭다운 */}
            {isMyComment && isCommentCardMemuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20"
                    onMouseLeave={() => setIsCommentCardMemuOpen(false)}> 
                    <ul className="py-1">
                        <li>
                            <button onClick={handleCommentEdit} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Edit size={16} /> 댓글 수정하기
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={handleCommentDelete} 
                                disabled={isDeleting}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                                <Trash2 size={16} /> 댓글 삭제하기
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            {isMyComment && isCommentEditModalOpen &&
                <CommentEditModal
                    postId={postId}
                    comment={comment}
                    onClose={() => setIsCommentEditModalOpen(false)}
                />    
            }
        </div>
    ) 
}