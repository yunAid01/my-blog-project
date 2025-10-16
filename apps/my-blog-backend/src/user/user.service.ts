import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'; // 1. bcrypt를 import 합니다.
import { JwtService } from '@nestjs/jwt'; // 1. JwtService를 import 합니다.
import { LoginUserDto } from './dto/login-user.dto';
import type { AuthenticatedUser } from './types/user,types';
// (login-user.dto.ts 파일은 CreateUserDto와 내용이 동일합니다. 새로 만들어주세요.)

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  // create 메서드를 async/await를 사용하도록 변경합니다.
  async create(createUserDto: CreateUserDto) {
    const { email, password, nickname } = createUserDto;
    if (!email || !password || !nickname) {
      throw new NotFoundException("이메일, 비밀번호, 닉네임은 필수 입력 사항입니다.");
    }

    // 2. 비밀번호를 해싱합니다.
    // bcrypt.hash(평문 비밀번호, saltOrRounds)
    // saltOrRounds는 해싱의 복잡도를 결정하는 숫자입니다. 높을수록 안전하지만 오래 걸립니다. 보통 10-12를 사용합니다.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 해싱된 비밀번호로 유저를 생성합니다.
    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        nickname: nickname,
      },
    });

    // 4. 보안을 위해, 생성된 유저 정보에서 비밀번호 필드를 제거하고 반환합니다.
    // 'password' 속성을 별도의 변수로 빼내고(하지만 사용하지 않음), '...rest'를 사용해
    // 나머지 속성들만 'userWithoutPassword'라는 새로운 객체에 담습니다.
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword; // 비밀번호가 제외된 새로운 객체를 반환합니다.
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // 3. 이메일로 유저가 존재하는지 확인합니다.
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new NotFoundException('해당하는 이메일의 유저를 찾을 수 없습니다.');
    }

    // 4. 입력된 비밀번호와 DB의 암호화된 비밀번호를 비교합니다.
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // 5. 비밀번호가 일치하면, '출입증(JWT)'을 생성합니다.
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const { password: _ ,...userWithoutPassword } = user;
    // 6. 생성된 출입증을 반환합니다.
    return {
      message: '로그인 성공!',
      accessToken,
      user: userWithoutPassword
    };
  }

  // API 확인용
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  // frontend => userGetMe method -> 로그인 데이터 유지
  // controller api_url/user/:id/me
  async findMe(userId: number) {
    const me = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    if (!me) {
      throw new NotFoundException('해당하는 유저를 찾을 수 없습니다.');
    }
    const { password: _, ...userWithoutPassword } = me;
    console.log(userWithoutPassword);
    return userWithoutPassword
  }

  // userProfilePage에서 사용할 유저 + 게시글 조회
  async findUserWithAllData(userId: number) {
    const findOneUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          include: {
            likes: true,
            comments: true,
            author: {
              select: {
                id: true,
                email: true,
                nickname: true
              }
            }
          }
        },
        // 날 팔로우 하는 사람
        followers: {
          where: {
            followingId: userId
          },
          include: {
            follower: {
              select: {
                id: true,
                email: true,
                nickname: true
              }
            }
          }
        },
        // 내가 팔로우 하는 사람
        followings: {
          where: {
            followerId: userId
          },
          include: {
            following: {
              select: {
                id: true,
                email: true,
                nickname: true
              }
            }
          }
        },
        likes: {
          include: {
            post: {
              include: {
                author: {
                  select: {
                    id: true,
                    email: true,
                    nickname: true
                  }
                }
              }
            }
          }
        }

      }
    });

    if (!findOneUser) {
      throw new NotFoundException('해당하는 유저를 찾을 수 없습니다.');
    }
    const { password: _, ...userWithoutPassword } = findOneUser;
    console.log(userWithoutPassword)
    return userWithoutPassword;
  }

  // 유저정보 업그레이드
  // id = 업데이터하려는 유저의id , user.id = 현재 로그인한 유저의 id
  async update(
    id: number,
    user: AuthenticatedUser,
    updateUserDto: UpdateUserDto
  ) {
    if (id !== user.id) {
      throw new UnauthorizedException('본인의 정보만 수정할 수 있습니다.');
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: updateUserDto,
      });
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('유저 정보 수정에 실패했습니다.');
    }
  }

  // 회원탈퇴
  async remove(id: number, user: AuthenticatedUser) {
    const userId = user.id

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
