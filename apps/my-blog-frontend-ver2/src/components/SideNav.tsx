// src/components/SideNav.tsx
'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  PlusSquare,
  Search,
  LogIn, // 로그인 아이콘 추가
  LogOut, // 로그아웃 아이콘 추가
  User, // 프로필 아이콘 추가
} from 'lucide-react';

export default function SideNav() {
  const { data: loginUser, isLoading } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('user-id');
    queryClient.setQueryData(['me'], null);
    alert('로그아웃 되었습니다');
    router.push('/login');
  };

  const navLinks = [
    { href: '/', icon: <Home />, text: '홈' },
    { href: '/search', icon: <Search />, text: '검색' },
    { href: '/posts/create', icon: <PlusSquare />, text: '만들기' },
  ];

  return (
    // [REFACTORED]
    // - w-64 -> w-20 lg:w-64 (반응형 너비)
    // - bg-white -> bg-black (배경색 변경)
    // - border-r -> border-r border-gray-700 (어두운 배경에 맞는 테두리색)
    // - transition-all duration-200 (너비 변경 시 부드러운 효과)
    <aside className="fixed left-0 top-0 z-10 h-full w-20 border-r border-gray-700 bg-black transition-all duration-200 lg:w-64">
      <div className="flex h-full flex-col">
        {/* 로고 */}
        {/* [REFACTORED]
            - p-6 -> p-4 lg:p-6 (모바일 패딩 조절)
            - border-b -> border-b border-gray-700
            - flex, justify-center, lg:justify-start, items-center (로고 정렬)
            - h-20 (로고 영역 높이 고정)
        */}
        <div className="flex h-20 items-center justify-center border-b border-gray-700 p-4 lg:justify-start lg:p-6">
          <Link href="/" className="text-2xl font-bold text-white">
            {/* [REFACTORED] 너비에 따라 텍스트/약어 표시 */}
            <span className="hidden lg:inline">My-Blog</span>
            <span className="lg:hidden">BG</span>
          </Link>
        </div>

        {/* 메뉴 */}
        {/* [REFACTORED] p-4 -> p-2 lg:p-4 (모바일 패딩 조절) */}
        <nav className="flex-1 p-2 lg:p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  // [REFACTORED]
                  // - hover:bg-zinc-100 -> text-gray-300 hover:bg-gray-800 hover:text-white (다크모드 호버)
                  // - justify-center lg:justify-start (모바일에선 아이콘 중앙, 데스크탑에선 좌측)
                  // - gap-4 -> lg:gap-4 (데스크탑에서만 gap 적용)
                  // - pathname === link.href ? 'font-bold' -> 활성 링크 스타일 변경
                  className={`flex items-center rounded-lg p-3 text-lg text-gray-300 transition-colors hover:bg-gray-800 hover:text-white justify-center lg:justify-start lg:gap-4 ${
                    pathname === link.href
                      ? 'font-bold text-white bg-gray-800' // 활성 링크 스타일
                      : ''
                  }`}
                >
                  {link.icon}
                  {/* [REFACTORED] hidden lg:inline (데스크탑에서만 텍스트 표시) */}
                  <span className="hidden lg:inline">{link.text}</span>
                </Link>
              </li>
            ))}

            {/* 프로필 및 로그아웃 */}
            {/* [REFACTORED]
                - border-t -> border-t border-gray-700
                - p-4 -> p-2 lg:p-4 (모바일 패딩 조절)
            */}
            <li className="mt-auto border-t border-gray-700 p-2 lg:p-4">
              {isLoading ? (
                // [REFACTORED] bg-gray-200 -> bg-gray-700 (다크모드 스켈레톤)
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-700" />
              ) : loginUser ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    href={`/user/${loginUser.id}`}
                    // [REFACTORED] 아이콘/텍스트 중앙 정렬 및 호버 효과
                    className="flex w-full items-center justify-center rounded-lg py-2 text-white transition-colors hover:bg-gray-800"
                  >
                    <User className="h-6 w-6 lg:hidden" />
                    <span className="hidden lg:inline text-center">
                      My profile : {loginUser.nickname}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    // [REFACTORED] 아이콘/텍스트 중앙 정렬
                    className="flex w-full items-center justify-center rounded-lg bg-red-500 py-2 text-white transition-colors hover:bg-red-600"
                  >
                    <LogOut className="h-6 w-6 lg:hidden" />
                    <span className="hidden lg:inline">로그아웃</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  // [REFACTORED] 아이콘/텍스트 중앙 정렬
                  className="flex w-full items-center justify-center rounded-lg bg-blue-500 py-2 text-center text-white transition-colors hover:bg-blue-600"
                >
                  <LogIn className="h-6 w-6 lg:hidden" />
                  <span className="hidden lg:inline">로그인</span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}