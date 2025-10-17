// create comment
import type { CreateCommentDto } from "@my-blog/types";
export const createComment = async ({ postId, text }: { postId: number, text: string } ) => {
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        alert('로그인이 필요합니다 !');
        throw new Error('로그인 필요');
        return;
    }

    const commentData: CreateCommentDto = {
        text
    };
    const API_URL=process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(commentData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`에러 발생: ${errorData.message}` || '댓글 작성에 실패했습니다')
    };
    return response.json();
}