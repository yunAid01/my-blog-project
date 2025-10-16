// 게시물의 타입도 정의해두면 좋습니다.

export interface Comment {
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
export interface CreateCommentDto {
    text: string;
}

export interface Like {
    userId: number;
    postId: number;
    author: {
        id: number;
        nickanme: string;
        email: string;
    }
}
// database model post
export interface Post {
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
    comments: Comment[];
    likes: Like[];
}


// cretae new post
export interface CreatePostDto {
    title: string;
    content: string;
}

export interface UpdatePostDto {
    title?: string;
    content?: string;
}