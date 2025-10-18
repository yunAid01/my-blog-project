// src/components/SideNav.tsx
'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser'; // 우리가 만든 훅!
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { Home, PlusSquare, Search } from 'lucide-react'; // 아이콘 라이브러리 (아래 설명 참조)

export default function SideNav() {
    // useUser 훅을 호출해서 사용자 정보를 가져옵니다.
    const { data: loginUser, isLoading } = useUser();
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('jwt-token');
        localStorage.removeItem('user-id')
        queryClient.setQueryData(['me'], null); 
        alert('로그아웃 되었습니다')
        router.push('/login');
    };

    const navLinks = [
        { href: '/', icon: <Home />, text: '홈' },
        { href: '/search', icon: <Search />, text: 'comming soon...' },
        { href: '/posts/create', icon: <PlusSquare />, text: '만들기' },
    ];

    return (
        <aside className="fixed left-0 top-0 z-10 h-full w-64 border-r bg-white">
            <div className="flex h-full flex-col">
                {/* 로고 */}
                <div className="border-b p-6">
                    <Link href="/" className="text-2xl font-bold">
                        My-Blog
                    </Link>
                </div>

                {/* 메뉴 */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`flex items-center gap-4 rounded-lg p-3 text-lg transition-colors hover:bg-zinc-100 ${
                                    pathname === link.href ? 'font-bold' : ''
                                }`}
                            >
                                {link.icon}
                                <span>{link.text}</span>
                            </Link>
                        </li>
                        ))}
                        
                        {/* 프로필 및 로그아웃 */}
                        <li className="mt-auto border-t p-4">
                            {isLoading ? (
                                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                            ) : loginUser ? (
                                <div className="flex flex-col space-y-2">
                                    <Link href={`/user/${loginUser.id}`}>
                                        <span className='text-center'>My profile : {loginUser.nickname}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full rounded-lg bg-red-500 py-2 text-white transition-colors hover:bg-red-600"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block w-full rounded-lg bg-blue-500 py-2 text-center text-white transition-colors hover:bg-blue-600"
                                >
                                    로그인
                                </Link>
                            )}
                        </li>
                    </ul>

                </nav>

                
            </div>
        </aside>
    );
}