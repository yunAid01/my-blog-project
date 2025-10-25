// components/Modal/ConversationCreateModal.tsx

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { X, Search } from 'lucide-react';
import { PublicUser } from '@my-blog/types'; //
// import { getFollowings } from '@/api/follow'; // (1. 이 API 함수가 필요합니다)
import { createDmConversation, getFollowings } from '@/api/dm'; // (2. 이 API 함수가 필요합니다)


interface ConversationCreateModalProps {
    onClose: () => void;
}
export default function ConversationCreateModal({ onClose }: ConversationCreateModalProps) {
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    // todo : 내가 팔로잉 한 사람들 찾기 api 만들어야 함
    const {
        data: followings,
        isLoading: isFollowingsLoading
    } = useQuery<PublicUser[]>({
        queryFn: () => getFollowings(),
        queryKey: ['followings'],
    });

    // 2. [로직] 검색어로 유저 목록을 필터링합니다.
    const filteredUsers = followings?.filter((followings) =>
        followings.nickname.toLowerCase().includes(search.toLowerCase()),
    );

    // 3. [액션] '대화' 버튼 클릭 시 실행될 뮤테이션
    const { mutate: startChatAction, isPending } = useMutation({
        mutationFn: createDmConversation,
        onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        router.push(`/dm/${data.id}`);
        onClose(); // 모달 닫기
        },
        onError: (error) => {
        console.error(error);
        alert('대화방 생성에 실패했습니다.');
        },
    });

    // 4. [핸들러] '대화' 버튼 클릭 핸들러
    const handleStartChat = () => {
        if (!selectedUser) return;
        const selectUsers = [selectedUser.id]
        startChatAction(selectUsers);
    };

    return (
        // 5. [UI] 모달 배경 (클릭 시 닫기)
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        >
        {/* 6. [UI] 모달 컨텐츠 (클릭 이벤트 전파 방지) */}
        <div
            className="relative flex flex-col w-full max-w-md h-[70vh] bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            {/* 7. [UI] 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    <X size={20} />
                </button>

                <h2 className="text-lg font-bold">새로운 메시지</h2>

                <button
                    onClick={handleStartChat}
                    disabled={!selectedUser || isPending}
                    className="font-bold text-sky-500 hover:text-sky-600 disabled:text-zinc-400"
                >
                    대화
                </button>
            </div>

            {/* 8. [UI] 검색창 */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-zinc-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </div>

            {/* 9. [UI] 유저 목록 (스크롤) */}
            <div className="flex-1 overflow-y-auto p-2">
            {isFollowingsLoading ? (
                <div className="p-4 text-center text-zinc-500">
                팔로잉 목록을 불러오는 중...
                </div>
            ) : (
                filteredUsers?.map((user) => (
                <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                    {/* (임시) 프로필 이미지 */}
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    <span className="font-semibold">{user.nickname}</span>
                    {/* 선택 표시 (라디오 버튼) */}
                    <div className="ml-auto w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center">
                    {selectedUser?.id === user.id && (
                        <div className="w-3 h-3 rounded-full bg-sky-500" />
                    )}
                    </div>
                </div>
                ))
            )}
            </div>
        </div>
        </div>
    );
}