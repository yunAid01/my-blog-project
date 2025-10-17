import type { GetUserForProfileReturn } from "@my-blog/types";

export const getUserForProfile = async (userId: number): Promise<GetUserForProfileReturn> => {
    const API_URL=process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/user/${userId}`)

    if (!response.ok) {
        const errorData = await response.json()
        console.error(`에러 발생 : ${errorData.message}`)
        throw new Error(errorData.message || '유저 정보를 가져오는데 실패했습니다.');
    }
    return response.json()
}