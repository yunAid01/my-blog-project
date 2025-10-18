// 게시물의 타입도 정의해두면 좋습니다.
import { Post } from "@prisma/client";
// user post tab

export interface UserTapComment {
    id: number;
    createdAt: string;
    updatedAt: string;
    postId: number;
    authorId: number;
    text: string;
}
export interface UserTapLike {
    userId: number;
    postId: number;
}
export interface UserTabPost {
    id: number;
    title: string;
    content: string | null;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    likes: UserTapLike[];
    comments: UserTapComment[];
}

export interface CreateCommentDto {
    text: string;
}

export interface GetPostReturnLike {
    userId: number;
    postId: number;
    author: {
        id: number;
        nickanme: string;
        email: string;
    }
}
export interface GetPostReturnComment {
    id: number;
    text: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: number;
        nickname: string;
        email: string;
        }
}
// getPostReturn
export interface GetPostReturn {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    author: {
        id: number;
        nickname: string;
        email: string;
    };
    comments: GetPostReturnComment[] | [];
    likes: GetPostReturnLike[] | [];
}


// cretae new post
export interface CreatePostData {
    title: string;
    content?: string;
}

export interface UpdatePostData {
    title?: string;
    content?: string;
}