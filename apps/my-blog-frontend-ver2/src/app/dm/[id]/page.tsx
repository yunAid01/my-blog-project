// app/dm/[id]/page.tsx (UI/UX 개선 버전)
'use client';

// 로직 관련 import (변경 없음)
import { io, Socket } from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react'; // 1. useRef 추가
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Message } from '@my-blog/types'; //
import { getDmMessages } from '@/api/dm';
import { useUser } from '@/hooks/useUser'; //

// UI 관련 import
import { SendHorizontal } from 'lucide-react'; //
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// === 로직 (변경 없음) ===
interface DmPageProps {
  params: {
    id: string;
  };
}
export default function DmPage({ params }: DmPageProps) {
  const queryClient = useQueryClient();
  const { data: userLogin } = useUser();
  const conversationId = parseInt(params.id);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [text, setText] = useState('');

  // A. [데이터] useQuery (변경 없음)
  const { data: messages, isLoading, isError, error } = useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: () => getDmMessages(conversationId),
  });

  // B. [실시간] useEffect (변경 없음)
  useEffect(() => {
    const newSocket = io('http://localhost:3000'); // (백엔드 주소 확인)
    setSocket(newSocket);

    newSocket.on('receiveMessage', (newMessage: Message) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (oldData: Message[] | undefined) => [...(oldData || []), newMessage],
      );
    });

    return () => {
      newSocket.off('receiveMessage');
      newSocket.disconnect();
    };
  }, [conversationId, queryClient]);

  // C. [전송] handleSubmit (변경 없음)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 2. [개선] userLogin과 text가 비어있지 않은지 확인
    if (socket && userLogin && text.trim()) {
      socket.emit('sendMessage', {
        conversationId,
        senderId: userLogin.id,
        createDmDto: {
          text: text,
        },
      });
      setText(''); // 입력창 비우기
    }
  };

  // 3. [UI 로직] 메시지 목록 맨 아래로 자동 스크롤
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // messages가 업데이트될 때마다 실행

  // === 렌더링 (UI/UX 개선) ===
  return (
    // 4. 전체 채팅방 컨테이너 (flex-col, 높이 90vh)
    <div className="flex flex-col h-[90vh] bg-white dark:bg-black">
      {/* 5. 채팅방 헤더 (뒤로가기, 대화방 ID) */}
      <div className="flex-shrink-0 p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
        <Link href="/dm" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-lg font-bold">대화방 #{conversationId}</h2>
      </div>

      {/* 6. 로딩 및 에러 상태 표시 */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          메시지를 불러오는 중입니다...
        </div>
      )}
      {isError && (
        <div className="flex-1 flex items-center justify-center text-red-500">
          에러 발생: {error?.message || '알 수 없는 오류'}
        </div>
      )}

      {/* 7. [핵심] 메시지 목록 렌더링 영역 (스크롤) */}
      {!isLoading && !isError && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((msg) => {
            // 8. 내가 보낸 메시지인지 확인
            const isMine = msg.sender.id === userLogin?.id;

            return (
              // 9. 메시지 버블 정렬 (내가 보냈으면 오른쪽)
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-2 max-w-sm">
                  {/* 10. (상대방) 프로필 이미지 (임시) */}
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0" />
                  )}
                  {/* 11. 말풍선 (Bubble) */}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isMine
                        ? 'bg-sky-500 text-white rounded-br-none' // 내 말풍선
                        : 'bg-zinc-100 dark:bg-zinc-800 rounded-bl-none' // 상대방 말풍선
                    }`}
                  >
                    {/* 12. (상대방) 닉네임 */}
                    {!isMine && (
                      <b className="text-xs font-bold block mb-1">
                        {msg.sender.nickname}
                      </b>
                    )}
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {/* 13. 자동 스크롤을 위한 빈 div */}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 14. [핵심] 메시지 전송 폼 (페이지 하단 고정) */}
      <div className="flex-shrink-0 p-4 border-t border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* 15. 입력창 (둥글게) */}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="메시지 입력..."
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-full bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {/* 16. 전송 버튼 (아이콘) */}
          <button
            type="submit"
            disabled={!text.trim() || !socket || isLoading}
            className="flex-shrink-0 p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizontal size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}