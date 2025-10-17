
// createLike
// 포스터에 좋아요를 성공적으로 눌렀습니다.
interface result {
    message: string;
}
export const createLike = async (postId: number): Promise<result> => {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL 
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        throw new Error('로그인이 필요합니다.')
    }

    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
            'Authorization':`Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '좋아요 처리에 실패했습니다.');
    };
    return response.json();
};
    
// deleteLike
// 포스트의 좋아요를 취소했습니다.
export const deleteLike = async (postId: number): Promise<result> => {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL 
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        throw new Error('로그인이 필요합니다.')
    }

    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'DELETE',
        headers: {
            'Authorization':`Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '좋아요을 삭제할 권한이 없습니다..');
    };
    return response.json();
}   