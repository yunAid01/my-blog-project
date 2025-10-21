import type { UserForProfile, PublicUser, UserTabPost } from "@my-blog/types";
import apiClient from "./client";

/** get user data by id for profile page */ 
export const getUserForProfile = async (userId: number): Promise<UserForProfile> => {
    const userData: UserForProfile = await apiClient.get(`user/${userId}`);
    console.log(userData);
    return userData
}

// --------------------------------------------------------- //

/** ✅ 1. 유저 포스트 탭에서 유저의 게시글 가져오기 */
export const getUserPosts = async (userId: number): Promise<UserTabPost[]> => {
    const userPosts: UserTabPost[] = await apiClient.get(`user/${userId}/posts`);
    return userPosts;
}

/** ✅ 2. 유저가 좋아요 누른 글 가져오기 */ 
export const getUserLikedPosts = async (userId: number): Promise<UserTabPost[]> => {
    const userLikes: UserTabPost[] = await apiClient.get(`user/${userId}/likes`);
    return userLikes
}

/** ✅ 3. 유저가 저장한 글 가져오기 */
export const getUserSavedPosts = async (userId: number): Promise<UserTabPost[]> => {
    const userSaved: UserTabPost[] = await apiClient.get(`user/${userId}/saved`);
    return userSaved;
}

// --------------------------------------------------------- //

// update user by id
interface updateUserProfileData {
    userId: number;
    updateUserData: {
        email?:string;
        password?:string;
        nickname?:string;
    }
}
/** user profile update */
export const updateUserProfile = async ({ userId, updateUserData }: updateUserProfileData): Promise<PublicUser> => {
    const userUpdatedProfile: PublicUser = await apiClient.patch(`user/${userId}`, updateUserData);
    return userUpdatedProfile
}

// --------------------------------------------------------- //

export const deleteUser = async () => {
    
}