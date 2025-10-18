import type { GetUserForProfileReturn, PublicUser ,Post } from "@my-blog/types";
import apiClient from "./client";

// get user by id for profile
export const getUserForProfile = async (userId: number): Promise<GetUserForProfileReturn> => {
    const API_URL=process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/user/${userId}`)

    if (!response.ok) {
        const errorData = await response.json()
        console.error(`에러 발생 : ${errorData.message}`)
        throw new Error(errorData.message || '유저 정보를 가져오는데 실패했습니다.');
    }
    return response.json()
}

// ✅ 1. 유저 게시물 가져오기
export const getUserPosts = async (userId: number) => {
  // (apiClient를 사용한다고 가정)
    const response = await apiClient.get(`/user/${userId}/posts`);
    console.log(response.data);
    return response.data;
}

// ✅ 2. 유저가 좋아요 누른 글 가져오기
export const getUserLikedPosts = async (userId: number) => {
    const response = await apiClient.get(`/user/${userId}/likes`);
    return response.data;
}

// ✅ 3. 유저가 저장한 글 가져오기
export const getUserSavedPosts = async (userId: number) => {
    const response = await apiClient.get(`/user/${userId}/saved`);
    return response.data;
}






// update user by id
interface updateUserProfileData {
    userId: number;
    updateUserData: {
        email?:string;
        password?:string;
        nickname?:string;
    }
}
export const updateUserProfile = async ({ userId, updateUserData }: updateUserProfileData): Promise<PublicUser> => {
    const API_URL=process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        throw new Error('로그인이 필요합니다 ...')
    }

    const response = await fetch(`${API_URL}/user/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(updateUserData)
    });
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`프로필 업데이트 응답 에러 : ${errorData.message}`)
    }
    return response.json();
}

export const deleteUser = async () => {
    
}