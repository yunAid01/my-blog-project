// src/app/register/page.tsx
'use client'; // 사용자 입력이 있으므로 클라이언트 컴포넌트

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 1. '비밀번호 확인' 입력값을 저장할 state를 추가합니다.
  const [passwordConfirm, setPasswordConfirm] = useState('');
  // 2. 에러 메시지를 저장할 state를 추가합니다.
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  // 3. 비밀번호와 비밀번호 확인 값이 바뀔 때마다 실행될 useEffect를 추가합니다.
  useEffect(() => {
    // 비밀번호 확인란에 무언가 입력되었고, 두 비밀번호가 일치하지 않는다면
    if (passwordConfirm && password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
    } else {
      // 일치하면 에러 메시지를 지웁니다.
      setError('');
    }
    // password 또는 passwordConfirm 값이 바뀔 때마다 이 함수를 실행합니다.
  }, [password, passwordConfirm]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 4. 제출 직전에 한번 더 확인합니다.
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return; // 함수를 여기서 중단시켜 API 요청을 보내지 않습니다.
    }
    
    try {
      // 1. API 경로를 '/user' (회원가입)으로 변경합니다.
      const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nickname, password }),
      });

      if (!response.ok) {
        // 백엔드 유효성 검사 에러 등을 처리합니다.
        // errorData.message를 사용하도록 수정
        const errorData = await response.json();
        const message = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
        alert(`회원가입 실패: ${message}`);
        return;
      }

      // 회원가입 성공
      alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
      
      // 2. 성공 후 로그인 페이지로 이동시킵니다.
      router.push('/login');

    } catch (error) {
      console.error('회원가입 중 에러 발생:', error);
      alert('회원가입 중 에러가 발생했습니다.');
    }
  };

  return (
    // JSX 구조는 로그인 페이지와 거의 동일합니다.
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>

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

          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="nickname">
              닉네임
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
              id="nickname"
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              비밀번호 (8자 이상)
            </label>
            <input
              // 에러가 있을 경우, 빨간색 테두리를 추가하는 조건부 클래스
              className={`shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 6. '비밀번호 확인' 입력 필드 추가 */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="passwordConfirm">
              비밀번호 확인
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
              id="passwordConfirm"
              type="password"
              placeholder="******************"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            {/* 7. 에러 메시지를 조건부로 표시 */}
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>


          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}