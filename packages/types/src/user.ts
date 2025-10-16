export interface userGetMe {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetUserWithAllData {
    id: number;
    nickname: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    posts: {
        id: number;
        title: string;
        content: string;
        createdAt: string;
        updatedAt: string;
        authorId: number;
        author: {
            id: string;
            email: string;
            nickname: string;
        }
    }[],
    followers: {
        followingId: number;
        follwerId: number;
        follower: {
            id: number;
            email: string;
            nickname: string;
        }
    }[],
    followings: {
        followingId: number;
        follwerId: number;
        following: {
            id: number;
            email: string;
            nickname: string;
        }
    }[]
}