// my-blog-backend/src/user/types/user.type.ts (새 파일)
import { PublicUser } from '@my-blog/types'

// Prisma의 User 타입에서 'password' 필드만 제외한 새로운 타입을 만듭니다.
export type AuthenticatedUser = PublicUser