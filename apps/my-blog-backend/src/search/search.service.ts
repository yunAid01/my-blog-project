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

}
