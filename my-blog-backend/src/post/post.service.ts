import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service'; // 1. PrismaService를 import 합니다.


@Injectable()
export class PostService {
  // 2. 클래스의 '생성자(constructor)'를 통해 PrismaService를 주입받습니다.
  // NestJS가 이 클래스를 초기화할 때, @Global()로 등록된 PrismaModule의 PrismaService 인스턴스를
  // 자동으로 찾아서 이 'prisma'라는 변수에 쏙 넣어줍니다.
  // (TypeScript 단축 문법: private readonly를 사용하면 변수 선언과 할당이 동시에 이루어집니다.)
  constructor(private readonly prisma: PrismaService) {}

  // 'create' 메서드: 새로운 게시글을 생성하는 기능을 담당합니다.
  create(createPostDto: CreatePostDto, userId: number) {
    // 2. 셰프가 주문서(DTO)를 받고, 식자재 공급팀(prisma)에게 재료를 창고에 넣어달라고 요청합니다.
    // this.prisma.post.create()는 새로운 Post 레코드를 생성하는 Prisma의 메서드입니다.
    // 'data' 필드에 DTO를 그대로 전달하면, Prisma가 DTO의 필드('title', 'content')와
    // Post 모델의 필드를 자동으로 매칭해서 데이터를 삽입해줍니다.
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: userId
      }
    });
  }

  // 'findAll' 메서드: 모든 게시글을 조회하는 기능을 담당합니다.
  findAll() {
    // 3. 주입받은 prisma 객체를 사용하여 데이터베이스에 쿼리를 실행합니다.
    // 'this.prisma.post'는 'schema.prisma'에 정의한 Post 모델에 접근하는 경로입니다.
    // .findMany()는 해당 모델의 모든 레코드(데이터)를 배열 형태로 반환하는 Prisma의 강력한 메서드입니다.
    // (이 코드는 SQL의 'SELECT * FROM Post;' 와 동일한 작업을 수행합니다.)
    return this.prisma.post.findMany({
      include: {
        likes: true,
        author: {
          select: {
            id: true,
            email: true,
            nickname: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  // 'findOne' 메서드: id가 일치하는 게시글 하나만 찾는 기능을 담당합니다.
  async findOne(postId: number) {
    const findOnePost = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true,
        author: {
          select: {
            id: true,
            email: true,
            nickname: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                email: true
              }
            }
          }
        }
      }
    });
    if (!findOnePost) {
      throw new NotFoundException('해당하는 포스트가 없습니다.');
    }
    return findOnePost;
  }

  // 내가 쓴 글만 찾는 메서드입니다.
  findMyPosts(userId: number) {
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        likes: true,
        author: {
          select: {
            id: true,
            email: true,
            nickname: true
          }
        }
      }
    });
  }

  // 'update' 메서드: id가 일치하는 게시글의 내용을 수정합니다.
  update(id: number, updatePostDto: UpdatePostDto) {
    // 셰프가 '1번 메뉴 수정 요청서'를 받고, 공급팀에게 창고의 재료를 업데이트하라고 지시합니다.
    // this.prisma.post.update()는 기존 레코드를 수정하는 Prisma의 메서드입니다.
    return this.prisma.post.update({
      // where: 어떤 레코드를 수정할지 고유한 id로 지정합니다.
      where: { id },
      // data: 어떤 내용으로 수정할지 DTO를 전달합니다.
      // DTO에 title만 있으면 title만, content만 있으면 content만 업데이트됩니다.
      data: updatePostDto,
    });
  }

  // 'remove' 메서드: id가 일치하는 게시글을 삭제합니다.
  remove(id: number) {
    // 셰프가 '주문 취소' 요청을 받고, 공급팀에게 창고에서 해당 재료를 폐기하라고 지시합니다.
    // this.prisma.post.delete()는 조건에 맞는 레코드를 삭제하는 Prisma의 메서드입니다.
    return this.prisma.post.delete({
      // where: 어떤 레코드를 삭제할지 고유한 id로 지정합니다.
      where: { id },
    });
  }
}
