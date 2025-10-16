// src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser'; // 우리가 만든 훅!
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function Header() {
    // useUser 훅을 호출해서 사용자 정보를 가져옵니다.
    const { data: user, isLoading } = useUser();
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('jwt-token');
        localStorage.removeItem('user-id')
        queryClient.setQueryData(['me'], null);
        router.push('/login');
    };

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600">My-Blog</Link>
                <div className="space-x-4">
                    {isLoading ? (
                        <div>로딩 중...</div>
                    ) : user ? (
                        // 로그인 상태일 때
                        <>
                            <span className="font-semibold">{user.nickname}님, 환영합니다!</span>
                            <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
                                로그아웃
                            </button>
                        </>
                    ) : (
                        // 로그아웃 상태일 때
                        <>
                            <Link href="/login" className="text-gray-600 hover:text-indigo-600">로그인</Link>
                            <Link href="/register" className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">회원가입</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}