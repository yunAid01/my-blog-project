import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  getMeUser,
  LoginReturn,
  PublicUser,
  UserForProfile,
  UserTabPost,
} from '@my-blog/types';

// utils
import { mapPostToDto } from 'src/utils/isoStringMapper';

import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'; // 1. bcrypt를 import 합니다.
import { JwtService } from '@nestjs/jwt'; // 1. JwtService를 import 합니다.
import { LoginUserDto } from './dto/login-user.dto';
import type { AuthenticatedUser } from './types/user.types';
// (login-user.dto.ts 파일은 CreateUserDto와 내용이 동일합니다. 새로 만들어주세요.)

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // create 메서드를 async/await를 사용하도록 변경합니다.
  async createUser(createUserDto: CreateUserDto): Promise<PublicUser> {
    const { email, password, nickname } = createUserDto;
    if (!email || !password || !nickname) {
      throw new ForbiddenException(
        '이메일, 비밀번호, 닉네임은 필수 입력 사항입니다.',
      );
    }
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (user) {
      throw new ForbiddenException('이미 존재하는 유저입니다..');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginReturn> {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new NotFoundException('해당하는 이메일의 유저를 찾을 수 없습니다.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    // 5. 비밀번호가 일치하면, '출입증(JWT)'을 생성합니다.
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      message: '로그인 성공',
      accessToken,
      user: {
        ...userWithoutPassword,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }

  // API 확인용
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  // frontend => userGetMe method -> 로그인 데이터 유지
  // controller API_URL]/user/:id/me
  async findMe(userId: number): Promise<getMeUser> {
    const me = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!me) {
      throw new NotFoundException('해당하는 유저를 찾을 수 없습니다.');
    }
    const {
      password: a,
      email: b,
      createdAt: c,
      updatedAt: d,
      ...getMeUser
    } = me;
    console.log(`getMe : ${me.id}`);
    return getMeUser;
  }

  /** 특정 유저가 올렸던 게시물만 가져오기 */
  async findUserPosts(userId: number): Promise<UserTabPost[]> {
    const userPosts = await this.prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        likes: true,
        comments: true,
      },
    });
    return userPosts.map(mapPostToDto);
  }

  /** 특정 유저가 좋아요 누른 게시물만 가져오기 */
  async findUserLikedPosts(userId: number): Promise<UserTabPost[]> {
    const likes = await this.prisma.like.findMany({
      where: { userId: userId },
      orderBy: { post: { createdAt: 'desc' } }, // 좋아요 누른 글의 최신순
      include: {
        post: {
          include: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    // 게시물 목록만 추출하여 반환
    const likedPosts = likes.map((like) => like.post);
    return likedPosts.map(mapPostToDto);
  }

  /** 특정 유저가 저장한 게시물만 가져오기 */
  async findUserSavedPosts(userId: number): Promise<UserTabPost[]> {
    const saved = await this.prisma.savedPost.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }, // 저장한 순서
      include: {
        post: {
          include: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    // 게시물 목록만 추출하여 반환
    const savedPosts = saved.map((save) => save.post);
    return savedPosts.map(mapPostToDto);
  }

  // userProfilePage에서 사용할 유저 + 게시글 조회
  async findUserForProfile(userId: number): Promise<UserForProfile> {
    const findOneUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        // 날 팔로우 하는 사람
        followers: {
          where: {
            followingId: userId,
          },
          include: {
            follower: {
              select: {
                id: true,
                email: true,
                nickname: true,
              },
            },
          },
        },
        // 내가 팔로우 하는 사람
        followings: {
          where: {
            followerId: userId,
          },
          include: {
            following: {
              select: {
                id: true,
                email: true,
                nickname: true,
              },
            },
          },
        },
      },
    });
    if (!findOneUser) {
      throw new NotFoundException('해당하는 유저를 찾을 수 없습니다.');
    }
    const { password: _, ...userWithoutPassword } = findOneUser;
    return {
      ...userWithoutPassword,
      createdAt: findOneUser.createdAt.toISOString(),
      updatedAt: findOneUser.updatedAt.toISOString(),
    };
  }

  // 유저정보 업그레이드
  // id = 업데이터하려는 유저의id , user.id = 현재 로그인한 유저의 id
  async updateUser(
    id: number,
    user: AuthenticatedUser, //publicUser
    updateUserDto: UpdateUserDto,
  ): Promise<PublicUser> {
    if (id !== user.id) {
      throw new UnauthorizedException('본인의 정보만 수정할 수 있습니다.');
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: updateUserDto,
      });
      const { password: _, ...userWithoutPassword } = updatedUser;
      return {
        ...userWithoutPassword,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error(error);
      throw new NotFoundException('유저 정보 수정에 실패했습니다.');
    }
  }

  // 회원탈퇴
  async removeUser(id: number, user: AuthenticatedUser) {
    const userId = user.id;

    if (userId !== id) {
      throw new UnauthorizedException('본인의 정보만 삭제할 수 있습니다.');
    }

    try {
      await this.prisma.user.delete({
        where: { id: id },
      });
      return { message: '유저 정보 삭제에 성공했습니다.' };
    } catch (error) {
      console.error(error);
      throw new NotFoundException('유저 정보 삭제에 실패했습니다.');
    }
  }
}
