'use client'

import { useState } from "react"
import { useUser } from "@/hooks/useUser"
import { useMutation } from "@tanstack/react-query"
import { deletePost } from "@/api/posts"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from 'next/navigation';
import { Edit, MoreVertical, Trash2 } from "lucide-react"

interface PostConfigProps {
    postAuthorId: number;
    postId: number;
}
export default function PostConfig ({ postAuthorId, postId }: PostConfigProps) {
    const router = useRouter();
    const { data: loginUser } = useUser(); 
    const queryClient = useQueryClient();
    const isMyPost = postAuthorId === loginUser?.id;
    const [isPostcardMemuOpen, setIsPostcardMenuOpen] = useState(false);

    const {
        mutate: deletePostAction,
        isPending: isDeleting
    } = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            alert('게시글삭제완료');
            queryClient.invalidateQueries({ queryKey: ['posts']})
            router.push('/')
        },
        onError: (error) => {
            console.error(`삭제 에러 : ${error}`)
            throw new Error(`삭제 에러 : ${error}`)
        }
    })
    const handlePostDelete = () => {
        if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
            deletePostAction(postId);
        }
        setIsPostcardMenuOpen(false); // 메뉴 닫기
    }

    // handle Edit
    const handlePostEdit = () => {
        router.push(`/posts/${postId}/edit`)
        setIsPostcardMenuOpen(false); // 메뉴 닫기
    }

    return(
        <div>
            {/* 점 세 개 아이콘 버튼 */}
            <button 
                onClick={() => setIsPostcardMenuOpen(!isPostcardMemuOpen)}                             className="p-2 rounded-full hover:bg-gray-100"
            >
                <MoreVertical size={20} />
            </button>
            {/* 메뉴가 열렸을 때 보여줄 드롭다운 */}
            {isMyPost && isPostcardMemuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20"
                    onMouseLeave={() => setIsPostcardMenuOpen(false)}> 
                    <ul className="py-1">
                        <li>
                            <button onClick={handlePostEdit} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Edit size={16} /> 수정하기
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={handlePostDelete} 
                                disabled={isDeleting}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                                <Trash2 size={16} /> 삭제하기
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    ) 
}