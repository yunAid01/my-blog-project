// userLoginDto
export interface loginUser {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
    updatedAt: string;
}


export interface CreateUserDto {
    email: string;
    password: string;
    nickname: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface UpdateUserDto {
    email?: string;
    password?: string;
    nickname?: string;
}