
export interface UpdateUserData {
    email?: string;
    nickname?: string;
    password?: string;
}

// 로그인 전역관리
export interface getMeUser {
    nickname: string;
    id: number;
}
export interface PublicUser {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
    updatedAt: string;
}
export interface LoginReturn {
    message: string;
    accessToken: string;
    user: PublicUser
}

export interface UserForProfile {
    id: number; //userId
    nickname: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    followers: {
        followingId: number;
        followerId: number;
        follower: {
            id: number;
            email: string;
            nickname: string;
        }
    }[];
    followings: {
        followingId: number;
        followerId: number;
        following: {
            id: number;
            email: string;
            nickname: string;
        }
    }[];
}