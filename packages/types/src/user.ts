// ----------------------------------------- //
export interface UpdateUserData {
  email?: string;
  nickname?: string;
  password?: string;
}

// ----------------------------------------- //
/** 로그인 전역관리 */
export interface getMeUser {
  nickname: string;
  id: number;
}

// ----------------------------------------- //
/** user data without user password  */
export interface PublicUser {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

/** user login data(message, token, publicUser) without password  */
export interface LoginReturn {
  message: string;
  accessToken: string;
  user: PublicUser;
}

/** user for profile (followers and followings) */
export interface UserForProfile {
  id: number; //userId
  nickname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  followers: {
    followingId: number;
    followerId: number;
    follower: {
      id: number;
      email: string;
      nickname: string;
    };
  }[];
  followings: {
    followingId: number;
    followerId: number;
    following: {
      id: number;
      email: string;
      nickname: string;
    };
  }[];
}
