// yunaid01/my-blog-project/apps/my-blog-frontend-ver2/src/api/client.ts

import axios from 'axios';

// 1. 기본 설정으로 axios 인스턴스(객체)를 생성합니다.
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 2. 요청 인터셉터(Request Interceptor) 설정
//    이 코드는 apiClient를 통해 보내는 *모든* 요청이 서버로 출발하기 *직전*에 가로채서
//    특정 작업을 추가할 수 있게 해줍니다.
apiClient.interceptors.request.use(
    (config) => {
        // 로컬 스토리지에서 토큰을 가져옵니다.
        const token = localStorage.getItem('jwt-token');

        // 토큰이 존재하면, 요청 헤더(headers)에 'Authorization' 이라는 이름으로 토큰을 담아 보냅니다.
        // 마치 택배 기사가 배송 전에 항상 신분증을 챙기는 것과 같아요!
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // 수정된 설정(config)으로 요청을 계속 진행합니다.
    },
    (error) => {
        // 요청 설정 중 에러가 발생하면 처리합니다.
        return Promise.reject(error);
    }
);

export default apiClient;