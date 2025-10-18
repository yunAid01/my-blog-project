import { createFollow, deleteFollow } from "@/api/follow";
import { UserForProfile, getMeUser } from "@my-blog/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// ✅ 설정 아이콘 임포트
import { Settings } from 'lucide-react';
import { useState } from "react";
import ProfileEditModal from "./ProfileEditModal";



interface UserConfigProps {
    loginUser: getMeUser | null | undefined
    userForProfile: UserForProfile
}
export default function UserConfig({ loginUser, userForProfile }: UserConfigProps) {
    const queryClient = useQueryClient();
    
    // userConfig
    // ✅ 메뉴와 모달의 열림 상태를 관리합니다.
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // ✅ 내 프로필인지 확인합니다.
    const isMyProfile = userForProfile.id === loginUser?.id

    // userPage의 id = login한 user의 id (follow 기능)
    const isFollowing = userForProfile.followers.some(follower => follower.followerId === loginUser?.id);
    const {
            mutate: toggleFollowAction,
            isPending
        } = useMutation({
            mutationFn: isFollowing ? deleteFollow : createFollow,
            onSuccess: () => {
                console.log('fuckyou')
                queryClient.invalidateQueries({ queryKey: ['user', userForProfile.id]})
            },
            onError: (error) => {
                console.error(`팔로우 기능 에러 : ${error.message}`)
                alert(`에러 발생 : ${error.message}`)
            }
        });
    const handleFollowClick = () => {
        toggleFollowAction(userForProfile.id)
    }

    return (
        <div className="flex items-center justify-center sm:justify-start space-x-4 mb-4">
            <h1 className="text-3xl font-light">{userForProfile.nickname}</h1>
                {/* 로그인한 유저와 프로필 유저가 다를때에만 팔로우를 보여줌 */}
                {/* <FollowButton userId={userForProfile.id} /> */}
                {loginUser?.id !== userForProfile.id && (
                    isFollowing ? (
                        <button 
                            className="bg-blue-200 text-white px-4 py-1.5 rounded-lg font-semibold text-sm"
                            onClick={handleFollowClick}
                            disabled={isPending}>
                            언팔로우
                        </button>
                    ) : (
                        <button 
                            className="bg-blue-500 text-white px-4 py-1.5 rounded-lg font-semibold text-sm"
                            onClick={handleFollowClick}
                            disabled={isPending}    >
                                팔로우
                        </button>
                    ))}

                    {isMyProfile && (
                         // 1. 바로 이 div가 '닻'입니다. (position: relative)
                        <div className="relative"> 
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full hover:bg-gray-200">
                                <Settings size={24} />
                            </button>
            
                            {/* 2. isMenuOpen이 true일 때 나타나는 '배'입니다. (position: absolute) */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                                    <ul onMouseLeave={() => setIsMenuOpen(false)}>
                                        <li>
                                            <button 
                                                onClick={() => {
                                                setIsEditModalOpen(true);
                                                setIsMenuOpen(false);}}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    프로필 수정
                                                </button>
                                            </li>
                                        </ul>
                                </div>)
                            }
                        </div>)
                    }

                    {/* ✅ 수정 모달: isEditModalOpen이 true일 때만 나타납니다. */}
                    {isMyProfile && isEditModalOpen && (
                        <ProfileEditModal 
                        user={userForProfile} 
                        onClose={() => setIsEditModalOpen(false)}/>
                    )}
        </div>
    )
}