// src/hooks/useUser.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/api/auth';
import type { userGetMe } from '@/types';

export function useUser() {
    // 로컬 스토리지에서 토큰을 가져옵니다. 'use client' 환경에서만 가능합니다.
    return useQuery<userGetMe | null>({
        // 1. 쿼리 키: 이 데이터의 고유한 이름표입니다. 'me'라고 붙여줄게요.
        queryKey: ['me'],
        queryFn: getMe,
        // 사용자가 다른 탭을 갔다가 돌아왔을 때 데이터를 자동으로 새로고침해주는 유용한 옵션입니다.
        refetchOnWindowFocus: true,
    });
}