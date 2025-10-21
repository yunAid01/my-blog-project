export interface CreateCommentData {
    text: string;
}

export interface UpdateCommentData {
    text: string;
}

export interface Comment {
    id: number;
    text: string;
    postId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
}
