// src/api.auth.ts

// 유저 등록 api
import type { CreateUserDto, LoginUserDto } from "@/types/auth"

export const userRegister = async (registerData: CreateUserDto): Promise<any> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
    });

    if (!response.ok) {
        // 서버가 보내준 에러 메시지를 사용자에게 보여주면 더 좋습니다.
        const errorData = await response.json();
        throw new Error(errorData.message || '알 수 없는 이유로 회원가입에 실패했습니다.');
    }
    return response.json();
}

// 6. 생성된 출입증을 반환합니다.
interface loginResult {
    message: string;
    accessToken: string;
}
export const userLogin = async (loginData: LoginUserDto): Promise<loginResult> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '이메일 또는 비밀번호를 확인해주세요.');
    }
    const result = await response.json()
    if (result.accessToken) {
        localStorage.setItem('jwt-token', result.accessToken)
    }
    return result;
}
