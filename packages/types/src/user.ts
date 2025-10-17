
import type { Post } from "@prisma/client";

export interface PublicUser {
    email: string;
    nickname: string;
    createdAt: Date;
    updatedAt: Date;
    id: number;
}
export interface LoginReturn {
    message: string;
    accessToken: string;
    user: PublicUser
}

export interface GetUserForProfileReturn {
    id: number; //userId
    nickname: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    posts: {
        id: number; //postId
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        authorId: number;
        author: {
            id: string;
            email: string;
            nickname: string;
        }
        likes: {
            postId: number;
            userId: number;
        }[] | [],
        comments: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            authorId: number;
            text: string;
            postId: number;
        }[] | [];
    }[] | [];
    likes: {
        userId: number,
        postId: number,
        post: {
            id: number; //postId
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string | null;
            authorId: number;
            author: {
                id: number;
                nickname: string;
                email: string;
            }
        }
    }
    followers: {
        followingId: number;
        followerId: number;
        follower: {
            id: number;
            email: string;
            nickname: string;
        }
    }[] | [],
    followings: {
        followingId: number;
        followerId: number;
        following: {
            id: number;
            email: string;
            nickname: string;
        }
    }[] | [],
}