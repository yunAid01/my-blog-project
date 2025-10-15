// src/app/login/page.tsx
'use client'; // useState, useMutation 등 훅을 사용하려면 꼭 필요해요!

import React, { useState } from 'react';
// useQuery 대신 useMutation을 가져옵니다!
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { userLogin } from '@/api/auth'; // 우리가 만든 userLogin API 함수


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // useMutation -> loainAction
    const { 
        mutate: loginAction,
        isPending,
        error
    } = useMutation({
        mutationFn: userLogin,
        onSuccess: (data) => {
            console.log(`로그인 성공 : ${data}`);
            alert('로그인에 성공했습니다 !')
            router.push('/')
        },
        onError: (error) => {
            console.error(`로그인 에러 : ${error}`)
        }
    })

    // login button handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert('이메일과 비밀번호를 모두 입력해주세요 !')
            return;
        }
        loginAction({ email, password });
    } 

    return(
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center">로그인</h1>
        
                    {/* form 태그로 이메일, 비밀번호 입력 필드와 버튼을 감싸요. */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-900">이메일</label>
                            <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900">비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="********"
                            />
                        </div>

                        {/* isPending이 true이면 (로그인 요청 중이면) 로딩 메시지를 보여줍니다. */}
                        {isPending && <p className="text-center text-gray-500">로그인 중...</p>}
                        
                        {/* error가 있으면 (로그인 실패하면) 에러 메시지를 보여줍니다. */}
                        {error && <p className="text-center text-red-500">{error.message}</p>}

                        <button
                            type="submit"
                            disabled={isPending} // 로그인 요청 중에는 버튼을 누르지 못하게 막아요.
                            className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            로그인하기
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}