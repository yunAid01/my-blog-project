// src/api/posts.ts

import type { GetPostReturn, UpdatePostData, CreatePostData } from "@my-blog/types";

// get
export const getPosts = async (): Promise<GetPostReturn[]>=> {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL 
    const response = await fetch(`${API_URL}/posts`); // 백엔드 주소

    if (!response.ok) {
    throw new Error('게시물을 불러오는 데 실패했습니다.');
    }

    return response.json();
};

// get post by Id
export const getPostById = async (postId: number): Promise<GetPostReturn> => {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL 
    const response = await fetch(`${API_URL}/posts/${postId}`);

    if (!response.ok) {
    throw new Error('게시물을 불러오는 데 실패했습니다.');
    }
    console.log('데이터 응답 완료')
    return response.json();
}


// post(create)
export const createPost = async (newPost: CreatePostData) => {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        alert('로그인이 필요합니다.')
        throw new Error('로그인하세요 로그인 ;;')
    }

    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(newPost),
    });

    if (!response.ok) {
        throw new Error('게시물 생성에 실패했습니다.')
    } 
    return response.json();
}

// 업데이트하기전에 그 해당 포스터의 데이터를 get으로 가져옴
export const getPostForEdit = async (postId: number) => {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL ;
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        alert('로그인이 필요합니다.')
        throw new Error('로그인 필요')
    }

    const response = await fetch(`${API_URL}/posts/${postId}/edit`, {
        method: 'GET',
        headers: {
            'Authorization':`Bearer ${token}`
        },
    });

    if (!response.ok) {
    throw new Error('업데이트할 게시물을 불러오는 데 실패했습니다.');
    }
    return response.json();
}

// update post
export const updatePost = async ({ postId, updatePostData } : { postId: number, updatePostData: UpdatePostData }) => {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('jwt-token')
    const loginUserId = localStorage.getItem('user-id')
    if (!token || !loginUserId) {
        console.error('로그인이 필요합니다.')
        throw new Error('로그인 필요')
    }

    const response = await fetch(`${API_URL}/posts/${postId}/edit`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(updatePostData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`게시글 수정 실패 에러 : ${errorData.message}`)
    }
    return response.json();
}

//delete post
export const deletePost = async (postId: number): Promise<void> => {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('jwt-token')
    const loginUserId = localStorage.getItem('user-id')
    if (!token || !loginUserId) {
        console.error('로그인이 필요합니다.')
        throw new Error('로그인 필요')
    }

    const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization':`Bearer ${token}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`게시글 삭제 실패 에러 : ${errorData.message}`)
    }
    return;
}