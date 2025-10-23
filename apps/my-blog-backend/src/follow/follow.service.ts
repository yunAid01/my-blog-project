import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  // 팔로우하기
  async create(followingId: number, userId: number) {
    if (followingId === userId) {
      throw new ForbiddenException('자기 자신은 팔로우할 수 없습니다.');
    }
    const isAlreadyFollowing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });

    if (isAlreadyFollowing) {
      throw new ForbiddenException('이미 팔로우한 사용자입니다.');
    }
    try {
      await this.prisma.follow.create({
        data: {
          followerId: userId,
          followingId: followingId,
        },
      });
      return { message: '팔로우 성공' };
    } catch (error) {
      console.error(error);
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
  }

  // 언팔로우하기
  async remove(followingId: number, userId: number) {
    if (followingId === userId) {
      throw new ForbiddenException('자기 자신은 언팔로우할 수 없습니다.');
    }

    const isAlreadyFollowing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });
    if (!isAlreadyFollowing) {
      throw new ForbiddenException(
        '팔로우하지 않은 사용자를 언팔로우 할 수 없습니다.',
      );
    }

    try {
      await this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: followingId,
          },
        },
      });
      return { message: '언팔로우 성공' };
    } catch (error) {
      console.error(error);
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
  }
}
