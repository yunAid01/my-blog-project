// src/api.auth.ts

// 유저 등록 api
import type { CreateUserDto, LoginUserDto } from '@my-blog/types';
import type { getMeUser, PublicUser, LoginReturn } from '@my-blog/types';

export const userRegister = async (
  registerData: CreateUserDto,
): Promise<PublicUser> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  });

  if (!response.ok) {
    // 서버가 보내준 에러 메시지를 사용자에게 보여주면 더 좋습니다.
    const errorData = await response.json();
    throw new Error(
      errorData.message || '알 수 없는 이유로 회원가입에 실패했습니다.',
    );
  }
  return response.json();
};

// 6. 생성된 출입증을 반환합니다.
export const userLogin = async (
  loginData: LoginUserDto,
): Promise<LoginReturn> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || '이메일 또는 비밀번호를 확인해주세요.',
    );
  }
  const result = await response.json();
  if (result.accessToken) {
    localStorage.setItem('jwt-token', result.accessToken);
    if (result.user && result.user.id) {
      localStorage.setItem('user-id', result.user.id);
    }
  }
  return result;
};

// 로그인 정보 전역관리
export const getMe = async (): Promise<getMeUser | null> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const userId = localStorage.getItem('user-id');
  const token = localStorage.getItem('jwt-token');
  if (!token || !userId) {
    return null;
  }
  const response = await fetch(`${API_URL}/user/${userId}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    // 토큰 만료, 잘못된 ID 등의 이유로 실패할 수 있습니다.
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('user-id');
    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
  }
  console.log(`get me success: ${response}`);
  return response.json();
};
