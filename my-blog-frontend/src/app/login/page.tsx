// src/app/login/page.tsx
'use client'; // 이 페이지는 사용자와의 상호작용이 필요하므로 클라이언트 컴포넌트로 만듭니다.

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // 1. 입력 폼의 상태를 관리하기 위해 useState를 사용합니다.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // 4. 페이지 이동을 위해 useRouter 훅을 사용합니다.

  // 2. 폼 제출(로그인 버튼 클릭) 시 실행될 함수입니다.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막습니다.
    
    // 3. 백엔드 API에 로그인 요청을 보냅니다.
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // 로그인 실패 시 (예: 401 Unauthorized)
        const errorData = await response.json();    
        alert(`로그인 실패: ${errorData.message}`);
        return;
      }

      // 로그인 성공 시
      const data = await response.json();
      // 실제 앱에서는 이 토큰을 localStorage나 쿠키에 저장해야 합니다.
      console.log(data)
      console.log('로그인 성공! 받은 토큰:', data.accessToken);
      // 1. localStorage에 accessToken을 'jwt-token'이라는 키로 저장합니다.
      localStorage.setItem('jwt-token', data.accessToken);  

      alert('로그인에 성공했습니다!');
      
      // 2. 페이지를 새로고침하여 로그인 상태를 앱 전체에 반영합니다.
      // (나중에 더 좋은 방법으로 바꿀 예정)
      window.location.href = '/'; 

    } catch (error) {
      console.error('로그인 중 에러 발생:', error);
      alert('로그인 중 에러가 발생했습니다.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              이메일
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              비밀번호
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}