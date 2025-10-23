import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { Comment } from '@my-blog/types';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  /** creaet comment */
  async create(
    postId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const newComments = await this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        authorId: userId,
        postId: postId,
      },
    });
    return {
      ...newComments,
      createdAt: newComments.createdAt.toISOString(),
      updatedAt: newComments.updatedAt.toISOString(),
    };
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

  // findOne 메서드를 '내부 검증용'으로도 활용할 수 있도록 실제 로직으로 채웁니다.
  async findOne(commentid: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentid },
    });
    if (!comment) {
      // 이제 '찾을 수 없음' 에러는 모두 NotFoundException으로 통일됩니다.
      throw new NotFoundException(
        `ID #${commentid}에 해당하는 댓글을 찾을 수 없습니다.`,
      );
    }
    return comment;
  }

  // ----------------------------------------------------------- //
  /** update comment */
  async update(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const willbeUpdatedComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!willbeUpdatedComment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    // 인가
    if (willbeUpdatedComment.authorId !== userId) {
      throw new ForbiddenException('이 댓글을 수정할 권한이 없습니다.');
    }

    try {
      const updatedComment = await this.prisma.comment.update({
        where: { id: commentId },
        data: {
          text: updateCommentDto.text,
        },
      });

      return {
        ...updatedComment,
        createdAt: updatedComment.createdAt.toISOString(),
        updatedAt: updatedComment.updatedAt.toDateString(),
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update comment');
    }
  }

  // ----------------------------------------------------------- //
  async remove(commentId: number, userId: number) {
    const willbeDeletedComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!willbeDeletedComment) {
      throw new NotFoundException('Comment not found');
    }
    if (willbeDeletedComment.authorId !== userId) {
      throw new ForbiddenException('이 댓글을 삭제할 권한이 없습니다.');
    }

    try {
      await this.prisma.comment.delete({
        where: { id: commentId },
      });
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete comment');
    }
  }
}
