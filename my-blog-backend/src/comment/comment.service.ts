import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  // 댓글 생성
  create(postId: number, createCommentDto: CreateCommentDto, userId: number) {
    return this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        authorId: userId,
        postId: postId,
      },
    });
  }

  // 특정 게시글의 모든 댓글 조회
  findAll(postId: number) {
    return this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      // 댓글 작성자 정보도 함께 포함
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // 오래된 댓글부터 정렬
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
