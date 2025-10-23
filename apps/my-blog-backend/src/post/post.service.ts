import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service'; // 1. PrismaService를 import 합니다.
import { GetPostReturn, Post, PostForMainPage } from '@my-blog/types';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  // --------------------------------------------------------- //
  /** create new post */
  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const newPost = await this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: userId,
      },
    });
    return {
      ...newPost,
      createdAt: newPost.createdAt.toISOString(),
      updatedAt: newPost.updatedAt.toISOString(),
    };
  }

  // --------------------------------------------------------- //
  /** get /posts | find all posts for main pages */
  async findAll(): Promise<PostForMainPage[]> {
    const allPosts = await this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc', // 최신순
      },
      include: {
        likes: true,
        author: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        comments: true,
      },
    });
    return allPosts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      comments: post.comments.map((comment) => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.createdAt.toISOString(),
      })),
    }));
  }

  // --------------------------------------------------------- //
  /** find one post for edit <original post> */
  async findOneForEdit(postId: number): Promise<Post> {
    const originalPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!originalPost) {
      throw new NotFoundException(
        '파일을 찾을 수 없어 업데이트가 불가능 합니다...',
      );
    }
    return {
      ...originalPost,
      createdAt: originalPost.createdAt.toISOString(),
      updatedAt: originalPost.updatedAt.toISOString(),
    };
  }

  // --------------------------------------------------------- //
  /** 특정 posts/[id]를 찾습니다. -> 게시글 상세페이지 */
  async findOne(postId: number): Promise<GetPostReturn> {
    const findOnePost = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true,
        author: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc', // 최신순으로 정렬
          },
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if (!findOnePost) {
      throw new NotFoundException('해당하는 포스트가 없습니다.');
    }

    return {
      ...findOnePost,
      createdAt: findOnePost.createdAt.toISOString(),
      updatedAt: findOnePost.createdAt.toISOString(),
      comments: findOnePost.comments.map((comment) => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      })),
    };
  }

  // --------------------------------------------------------- //
  /**  update post id가 일치하는 게시글의 내용을 수정합니다. */
  async update(postId: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const findPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!findPost) {
      throw new NotFoundException('페이지를 찾을 수 없습니다...');
    }
    const updatePost = await this.prisma.post.update({
      where: { id: postId },
      data: updatePostDto,
    });
    return {
      ...updatePost,
      createdAt: updatePost.createdAt.toISOString(),
      updatedAt: updatePost.updatedAt.toDateString(),
    };
  }

  // --------------------------------------------------------- //
  /** id가 일치하는 게시글을 삭제합니다. */
  async remove(postId: number) {
    await this.prisma.post.delete({
      where: { id: postId },
    });
    return {
      message: '게시글이 삭제되었습니다.',
    };
  }
}
