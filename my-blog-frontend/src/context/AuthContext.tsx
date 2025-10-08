// src/context/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// JWT payload의 타입을 정의합니다. (sub: user id, email)
interface UserPayload {
  sub: number;
  email: string;
}

// 1. 컨텍스트가 가지게 될 값들의 타입을 정의합니다.
interface AuthContextType {
  isLoggedIn: boolean;
  user: UserPayload | null; // user 상태 추가
  logout: () => void;
}

// 2. 컨텍스트를 생성합니다.
const AuthContext = createContext<AuthContextType | null>(null);

// 3. 컨텍스트를 앱 전체에 제공하는 'Provider' 컴포넌트를 만듭니다.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserPayload | null>(null); // user 상태 관리


  // 컴포넌트가 처음 렌더링될 때 localStorage를 확인해서 로그인 상태를 설정합니다.
  useEffect(() => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      const decoded: UserPayload = jwtDecode(token); // 토큰 해독
      setUser(decoded); // 유저 정보 설정
      setIsLoggedIn(true);
    }
  }, []); // 빈 배열은 최초 1회만 실행하라는 의미

  const logout = () => {
    localStorage.removeItem('jwt-token');
    setIsLoggedIn(false);
    // 로그아웃 후 홈페이지로 이동 (새로고침)
    setUser(null); // 유저 정보 초기화
    window.location.href = '/';
  };

  const contextValue = { isLoggedIn, logout, user }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. 다른 컴포넌트에서 이 컨텍스트를 쉽게 사용할 수 있게 해주는 '단축키' 훅(Hook)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}