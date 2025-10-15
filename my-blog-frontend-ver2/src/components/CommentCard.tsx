// src/compoenents/CommentCard.tsx
import type { Comment } from "@/types"

interface CommentCardProps {
    comment: Comment
}
export default function CommentCard ({ comment }: CommentCardProps) {
    

    return (
        <>
            <div>댓글 작성자 :{comment.author.nickname}</div>
            <div>댓글 내용 : {comment.text}</div>
            <div>작성일자 : {comment.createdAt}</div>
        </>
    )
}