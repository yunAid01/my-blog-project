// src/compoenets/LikeButton.tsx
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createLike } from "@/api/like";
import { Post } from "@/types";

interface LikeButtonProps {
    post: Post
    initialLikesCount: number;
}
export default function LikeButton ({ post, initialLikesCount }: LikeButtonProps) {
    const [likeCount, seti]
    const [isLiked, setIsLiked] = useState(false);
    
    // likeAction
    const {
        mutate: createLikeAction,

    } = useMutation({
        mutationFn: createLike,
        onSuccess: () => {
            console.log('종아요가 눌렸습니다 !')
        },
        onError: (error) => {
            console.error(error)
        }
    })
    
    // likeAction
    const handleLike = (e: React.FormEvent) => {
        e.preventDefault();
        createLikeAction(postId)
    }

    return (
        <>
            <button>
                하트
            </button>

        </>
    )
}