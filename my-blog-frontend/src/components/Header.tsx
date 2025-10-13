// src/components/Header.tsx
'use client'; // 훅(Hook)을 사용하므로 클라이언트 컴포넌트로 변경!

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // 1. 우리가 만든 useAuth 훅을 import

export default function Header() {
  const { isLoggedIn, logout } = useAuth(); // 2. 컨텍스트에서 로그인 상태와 로그아웃 함수를 가져옵니다.

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="font-bold text-xl hover:text-gray-300 transition-colors">
          My Blog
        </Link>
        <ul className="flex gap-6 items-center">
          <li><Link href="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
          <li><Link href="/posts" className="hover:text-gray-300 transition-colors">Posts</Link></li>

          {/* 3. isLoggedIn 상태에 따라 다른 메뉴를 보여줍니다. (삼항 연산자 사용) */}
          {isLoggedIn ? (
            // 로그인 상태일 때
            <>
              <li>
                <Link href="/users" className="hover:text-gray-300 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/posts/create" className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors text-sm font-semibold">
                  New Post
                </Link>
              </li>
              <li>
                <button onClick={logout} className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded transition-colors">
                  Logout
                </button>
              </li>
            </>
          ) : (
            // 로그아웃 상태일 때
            <>
              <li><Link href="/login" className="hover:text-gray-300 transition-colors">Login</Link></li>
              <li><Link href="/register" className="...">Signup</Link></li> 
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}