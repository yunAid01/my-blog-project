// src/app/register/page.tsx
'use client';


import { userRegister } from "@/api/auth";
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function RegisterPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isPasswordEqual, setIsPasswordEqual] = useState(true);
    const router = useRouter();

    // user register mutation
    const {
        mutate: registerAction,
        error,
        isPending
    } = useMutation({
        mutationFn: userRegister,
        onSuccess: (data) => {
            console.log(`로그인 성공 : ${data}`);
            alert('회원가입에 성공했습니다 !')
            router.push('/login')
        },
        onError: (error) => {
            console.error(`회원가입 에러 : ${error}`);
        }
    })

    // submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !nickname) {
            alert('이메일, 패스워드, 닉네임은 필수사항입니다 !')
            return;
        };
        if (password !== passwordConfirm) {
            alert('비밀번호가 서로 일치하지 않습니다 !')
            return;
        };
        registerAction({ email, nickname, password });
    }

    // useEffects
    useEffect(() => {
        if (passwordConfirm && password !== passwordConfirm) {
            setIsPasswordEqual(false);
        } else {
            setIsPasswordEqual(true)
        }
    }, [password, passwordConfirm])

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center">로그인</h1>
        
                    {/* form 태그로 이메일, 비밀번호 입력 필드와 버튼을 감싸요. */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">이메일</label>
                            <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com"
                            />
                        </div>

                        {/* nickname */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">닉네임</label>
                            <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com"
                            />
                        </div>

                        {/* password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="********"
                            />
                        </div>

                        {/* passwordConfirm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">비밀번호 확인</label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                                className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none 
                                ${isPasswordEqual 
                                    ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500' 
                                    : 'border-red-500 focus:ring-red-500 focus:border-red-500'}`
                                }
                                placeholder="********"
                            />
                            {!isPasswordEqual && (
                            <p className="mt-1 text-sm text-red-600">
                                비밀번호가 일치하지 않습니다.
                            </p>
                        )}
                        </div>

                        {/* isPending이 true이면 (회원가입 요청 중이면) 로딩 메시지를 보여줍니다. */}
                        {isPending && <p className="text-center text-gray-500">로그인 중...</p>}
                        
                        {/* error가 있으면 (회원가입 실패하면) 에러 메시지를 보여줍니다. */}
                        {error && <p className="text-center text-red-500">{error.message}</p>}

                        <button
                            type="submit"
                            disabled={isPending} // 회원가입 요청 중에는 버튼을 누르지 못하게 막아요.
                            className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            회원가입하기
                        </button>
                    </form>
                </div>
            </div> 
        </>
    )



}