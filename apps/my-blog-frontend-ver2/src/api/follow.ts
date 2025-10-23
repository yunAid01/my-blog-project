// follow
interface createFollowReturn {
  message: string;
}
export const createFollow = async (
  followedId: number,
): Promise<createFollowReturn> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('jwt-token');
  if (!token) {
    alert('로그인 필요');
    throw new Error('로그인이 필요합니다.');
  }
  const response = await fetch(`${API_URL}/user/${followedId}/follow`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`팔로우 오류 ${errorData.message}`);
  }
  return response.json();
};

// unfollow
interface deleteFollowReturn {
  message: string;
}
export const deleteFollow = async (
  unfollowedId: number,
): Promise<deleteFollowReturn> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('jwt-token');
  if (!token) {
    alert('로그인 필요');
    throw new Error('로그인이 필요합니다.');
  }
  const response = await fetch(`${API_URL}/user/${unfollowedId}/follow`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`언팔로우 오류 ${errorData.message}`);
  }
  return response.json();
};
