import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  // 팔로우하기
  async create(followedUserId: number, followingUserId: number) {
    if (followedUserId === followingUserId) {
      throw new ForbiddenException('자기 자신은 팔로우할 수 없습니다.');
    }
    const isAlreadyFollowing = await this.prisma.follow.findUnique({
      where: {
        followingId_followedId: {followingId: followingUserId, followedId: followedUserId}
      }
    });
    if (isAlreadyFollowing) {
      throw new ForbiddenException('이미 팔로우한 사용자입니다.');
    }
    try {
      await this.prisma.follow.create({
        data: {
          followedId: followedUserId, 
          followingId: followingUserId
        }
      });
      return { message: '팔로우를 성공했습니다 !! 축하드립니다 야호 레츠고 꾸익 딴따리따따' };
    } catch (error) {
      console.error(error);
      throw new ForbiddenException('존재하지 않는 사용자입니다.');
    }
  }

  findAll() {
    return `This action returns all follow`;
  }

  findOne(id: number) {
    return `This action returns a #${id} follow`;
  }

  // 언팔로우하기
  async remove(followedUserId: number, followingUserId: number) {
    if (followedUserId === followingUserId) {
      throw new ForbiddenException('자기 자신은 언팔로우할 수 없습니다.');
    }
    
    const isAlreadyFollowing = await this.prisma.follow.findUnique({
      where: {
        followingId_followedId: {followingId: followingUserId, followedId: followedUserId}
      }
    });
    if (!isAlreadyFollowing) {
      throw new ForbiddenException('팔로우하지 않은 사용자를 언팔로우 할 수 없습니다.');
    }
    
    try {
      await this.prisma.follow.delete({
        where: {
          followingId_followedId: {followingId: followingUserId, followedId: followedUserId}
        }
      })
      return { message: '언팔로우를 성공했습니다 !! 축하드립니다 야호 레츠고 꾸익 딴따리따따' };
    } catch (error) {
      console.error(error);
      throw new ForbiddenException('존재하지 않는 사용자입니다.');
    }
  }
}
