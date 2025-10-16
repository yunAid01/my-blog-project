// src/api/posts.ts

import type { Post, CreatePostDto, UpdatePostDto } from "@/types";

// get
export const getPosts = async (): Promise<Post[]>=> {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL 
    const response = await fetch(`${API_URL}/posts`); // 백엔드 주소

    if (!response.ok) {
    throw new Error('게시물을 불러오는 데 실패했습니다.');
    }

    return response.json();
};

// post(create)
export const createPost = async (newPost: CreatePostDto) => {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
    });

    if (!response.ok) {
        throw new Error('게시물 생성에 실패했습니다.')
    } 
    return response.json();
}

// (update)
export const updatePost = async (postId: number, updatedost: UpdatePostDto) => {
    const API_URL  = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PATCH',
        headers: {
            'Context-Type':'application/json'
        },
        body: JSON.stringify(updatedost)
    });

    if (!response.ok) {
        throw new Error('게시글 수정이 실패되었습니다.')
    }
    return response.json();
}