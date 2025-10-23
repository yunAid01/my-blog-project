import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  // 좋아요 추가하기
  async create(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('좋아요를 누를 수 있는 포스트가 없습니다.');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId: userId, postId: postId } },
    });
    if (existingLike) {
      throw new ForbiddenException('이미 좋아요를 누른 포스트입니다.');
    }

    try {
      await this.prisma.like.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });
      return { message: '포스트에 좋아요를 성공적으로 눌렀습니다.' };
    } catch (error) {
      console.error('Error creating like:', error);
      throw new InternalServerErrorException(
        '좋아요를 누를 수 없습니다 --서버에러--',
      );
    }
  }

  // 좋아요 카운트 및 포스트 좋아요 조회
  findAll() {
    return `This action returns all like`;
  }

  // 좋아요 취소하기
  async remove(postId: number, userId: number) {
    const like = await this.prisma.like.findUnique({
      where: { userId_postId: { postId: postId, userId: userId } },
    });
    if (!like) {
      throw new NotFoundException('취소할 좋아요가 없습니다.');
    }
    if (like.userId !== userId) {
      throw new ForbiddenException('본인의 좋아요만 취소할 수 있습니다.');
    }

    try {
      await this.prisma.like.delete({
        where: { userId_postId: { userId: userId, postId: postId } },
      });
      return { message: '포스트의 좋아요를 취소했습니다.' };
    } catch (error) {
      console.error('Error removing like:', error);
      throw new InternalServerErrorException(
        '좋아요 취소에 실패했습니다 --서버에러--',
      );
    }
  }
}
