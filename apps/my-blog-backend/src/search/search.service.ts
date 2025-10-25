import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { contains } from 'class-validator';
import { PostForSearchPage } from '@my-blog/types';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchPosts(keyword: string): Promise<PostForSearchPage[]>{
    const posts = await this.prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
              mode: 'insensitive',
            }
          },
          {
            content: {
              contains: keyword,
              mode: 'insensitive',
            }
          }
        ] 
      },
      include: {
        likes: true,
        comments: true,
        author: {
          select: {
            id: true,
            nickname: true,
            email: true,
          },
        },
      },
    });

    return posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      comments: post.comments.map((comment) => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toDateString()
      })),
    }));
  }

  // --------------------------------------------------------- //
  /** posts for search pages */
  async getPostsForSearchPage(currentUserId: number): Promise<PostForSearchPage[]> {
    const followings = await this.prisma.follow.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true, // follow 당하는사람
      },
    });

    const followingIds = followings.map((following) => following.followingId);
    // 5. 게시물 검색
    const posts = await this.prisma.post.findMany({
      where: {
        // 6. WHERE 조건:
        authorId: {
          // 7. 작성자(authorId)가 ...
          notIn: [currentUserId, ...followingIds], // '나'와 '내가 팔로우하는 ID 목록'에 포함되지 않는(!notIn) 게시물
        },
      },
      orderBy: {
        createdAt: 'desc', // 8. 최신순으로 정렬
      },
      take: 50, // 9. 일단 50개 정도 넉넉하게 가져오기
      include: {
        likes: true,
        comments: true,
        author: {
          select: {
            id: true,
            nickname: true,
            email: true,
          },
        },
      },
    });
    const shuffledPosts = posts.sort(() => 0.5 - Math.random());
    return shuffledPosts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      comments: post.comments.map((comment) => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString()
      })),
    }));
  }
}
