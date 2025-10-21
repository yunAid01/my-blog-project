
import type { Comment, CreateCommentData, UpdateCommentData } from "@my-blog/types";
import apiClient from "./client";


// ----------------------------------------------------------- //
interface CreateComment {
    postId: number;
    createCommentData: CreateCommentData
}
/** create comment */
export const createComment = async ({ postId, createCommentData }: CreateComment): Promise<Comment>=> {
    const comment: Comment = await apiClient.post(`posts/${postId}/comments`, createCommentData)
    return comment
}

// ----------------------------------------------------------- //
interface DeleteCommentData {
    commentId: number;
    postId: number;
}
interface DeleteCommentReturn {
    message: string;
}
/** delete comment */
export const deleteComment = async ({ commentId, postId } : DeleteCommentData): Promise<DeleteCommentReturn> => {
    const deleteCommentReturn: DeleteCommentReturn = await apiClient.delete(`posts/${postId}/comments/${commentId}`)
    return deleteCommentReturn
}   

// ----------------------------------------------------------- //
interface UpdateComment {
    commentId: number;
    postId: number;
    updateCommentData: UpdateCommentData
}
/** update comment */
export const updateComment = async ({ commentId, postId, updateCommentData }: UpdateComment): Promise<Comment>=> {
    const updateCommentReturn: Comment = await apiClient.patch(`posts/${postId}/comments/${commentId}`, updateCommentData)
    return updateCommentReturn
}

// ----------------------------------------------------------- //