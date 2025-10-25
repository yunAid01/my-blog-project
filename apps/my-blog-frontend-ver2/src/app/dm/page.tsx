// app/dm/page.tsx (기존 DmPage 파일)

'use client';

import { getDmConversations } from '@/api/dm';
import { Conversation } from '@my-blog/types'; //
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser'; //
import ConversationCreateModal from '@/components/Modal/ConversationCreateModal';
import Link from 'next/link'; // 1. Link 컴포넌트 추가
import { MessageSquarePlus } from 'lucide-react'; // 2. 새 메시지 아이콘 추가
import { useState } from 'react'; // 3. Modal 상태 관리를 위해 useState 추가

export default function DmPage() {
  // 4. 모달을 열고 닫기 위한 state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 5. 현재 로그인한 유저 정보 (상대방 닉네임을 찾기 위해)
    const { data: userLogin } = useUser();

    const {
        data: conversations,
        isLoading,
        isError,
        error,
    } = useQuery<Conversation[]>({ // 6. Error 타입 명시
        queryFn: () => getDmConversations(),
        queryKey: ['conversations'],
    });

    if (isLoading) {
        // 7. ✅ return 추가!
        return <div>로딩중...</div>;
    }

    if (isError) {
        // 8. ✅ return 추가! 및 .message로 에러 내용 표시
        return <div>에러 발생: {error.message}</div>;
    }

    return (
        // 9. DM 페이지 전체 레이아웃 (flex 사용)
        <div className="flex h-screen bg-white dark:bg-black">
        {/* 10. 왼쪽: 대화 목록 사이드바 */}
        <div className="w-full md:w-80 lg:w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
            {/* 11. 사이드바 헤더 (내 닉네임 + 새 메시지 버튼) */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h1 className="text-xl font-bold">{userLogin?.nickname}</h1>
            {/* '새 메시지' 버튼: 클릭 시 모달 열기 */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
            >
                <MessageSquarePlus size={24} />
            </button>
            </div>

            {/* 12. 대화 목록 (스크롤 영역) */}
            <div className="flex-1 overflow-y-auto">
            {conversations && conversations.length > 0 ? (
                conversations.map((conversation) => {
                // 13. [핵심] 대화방 참여자 중 '상대방' 정보 찾기
                const otherParticipant = conversation.participants.find(
                    (p) => p.id !== userLogin?.id,
                );

                return (
                    <Link
                        key={conversation.id}
                        href={`/dm/${conversation.id}`} // 14. 클릭 시 해당 대화방으로 이동
                        className="block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800"
                    >
                    <div className="flex items-center gap-3">
                        {/* (임시) 프로필 이미지 */}
                        <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0" />
                        <div>
                            <h2 className="font-semibold">
                                {otherParticipant
                                ? otherParticipant.nickname
                                : '(알 수 없음)'}
                            </h2>
                            <p className="text-sm text-zinc-500 truncate">
                                {/* (나중에 추가) 마지막 메시지 미리보기 */}
                                마지막 메시지...
                            </p>
                        </div>
                    </div>
                    </Link>
                );
                })
            ) : (
                // 15. 대화창이 없을 경우
                <div className="p-4 text-center text-zinc-500">
                    아직 대화창이 없습니다.
                </div>
            )}
            </div>
        </div>

        {/* 16. 오른쪽: 선택된 대화창 (지금은 비워둠) 
            (참고) /dm/[id]/page.tsx에서 이 영역을 채우게 됩니다.
        */}
        <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
            <h2 className="text-2xl font-semibold">내 메시지</h2>
            <p className="text-zinc-500">대화를 선택해 메시지를 확인하세요.</p>
            </div>
        </div>

        {/* 17. '새 메시지' 모달 (isModalOpen state로 제어) */}
        {isModalOpen && (
            <ConversationCreateModal onClose={() => setIsModalOpen(false)} />
        )}
        </div>
    );
}