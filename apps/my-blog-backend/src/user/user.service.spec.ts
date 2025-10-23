import { Test, TestingModule } from '@nestjs/testing';

// user dto
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

// real
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt'; // 1. '진짜 토큰 발급기' 설계도 import
import * as bcrypt from 'bcrypt'; // 1. '진짜' bcrypt 가져오기

import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PublicUser } from '@my-blog/types';
import { UpdateUserDto } from './dto/update-user.dto';

// 2. 🚨 "이 파일에서 'bcrypt'를 부르면, '가짜'를 줘!"라고 선언!
jest.mock('bcrypt', () => ({
  compare: jest.fn(), // 'compare' 함수를 '가짜'로 만듦
  hash: jest.fn(), // 'hash' 함수도 '가짜'로 만듦
}));

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// --- 🎟️ '가짜 토큰 발급기' 만들기 ---
const mockJwtService = {
  sign: jest.fn(),
  // (필요한 함수가 더 있으면 나중에 추가)
};

describe('UserService', () => {
  let service: UserService;

  // --- "가짜 데이터" 그릇 준비! (let) ---
  // 이 변수들은 모든 'it' 블록에서 재사용됩니다.
  let mockUserCreateData: CreateUserDto;
  let mockUserLoginData: LoginUserDto;
  let mockUserUpdateData: UpdateUserDto;
  let mockLoginedPublicUser: PublicUser;
  let fakeHashedPassword: string;
  let fakeUserDbResult;
  let fakeToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService, // 주인공(진짜 로직)
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService); // real

    // --- 👇 "가짜 데이터" 초기화! (beforeEach) ---
    // 매 시험(it) 전에 '새로운' 가짜 데이터를 만들어서
    // 시험끼리 서로 영향을 주지 않게 합니다.
    fakeHashedPassword = 'db-에-저장된-해시비번-모양';
    fakeToken = 'this-is-a-fake-token-string';
    mockUserCreateData = {
      email: 'test@email.com',
      nickname: 'tester',
      password: '1234',
    };
    mockUserLoginData = {
      email: 'test@email.com',
      password: '1234',
    };
    mockUserUpdateData = {
      email: 'jiwon@email.com',
      nickname: 'testerian',
    };
    fakeUserDbResult = {
      id: 1,
      email: 'test@email.com',
      nickname: 'tester',
      password: fakeHashedPassword,
      createdAt: new Date('2025-01-01T10:00:00.000Z'),
      updatedAt: new Date('2025-01-01T10:00:00.000Z'),
    };
    mockLoginedPublicUser = {
      id: 1,
      email: 'test@email.com',
      nickname: 'tester',
      createdAt: '2025-01-01T10:00:00.000Z',
      updatedAt: '2025-01-01T10:00:00.000Z',
    };
  });

  // (afterEach 추가 - 필수!)
  afterEach(() => {
    jest.clearAllMocks(); // '가짜' 배우들의 메모리를 깨끗이 청소!
  });

  it('should be defined (정의 되어야 함)', () => {
    expect(service).toBeDefined();
  });

  // ---------------------------------------------
  // 회원가입 (createUser)
  // ---------------------------------------------

  describe('user register', () => {
    it('should create new user with register data (회원가입 성공)', async () => {
      const expectedServiceResult = {
        // 최종리턴
        id: 1,
        email: 'test@email.com',
        nickname: 'tester',
        createdAt: '2025-01-01T10:00:00.000Z',
        updatedAt: '2025-01-01T10:00:00.000Z',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(fakeHashedPassword); // fake
      mockPrismaService.user.create.mockResolvedValue(fakeUserDbResult); // fake

      // 검증
      const result = await service.createUser(mockUserCreateData);
      expect(result).toEqual(expectedServiceResult);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: mockUserCreateData.email,
          nickname: mockUserCreateData.nickname,
          // "비밀번호는 '1234'가 아닌(not.stringContaining),
          //  '어떤 문자열(any(String))'이 들어갔어야 해!"
          password: expect.not.stringContaining(
            mockUserCreateData.password,
          ) as string,
        },
      });
    });

    it('should have email & password & nickname data for register (회원가입 실패)', async () => {
      const mockFailedUserCreateData = {
        // 일부러 틀린 데이터 넣음
        email: 'test@email.com',
        password: '1234',
      };
      await expect(
        service.createUser(mockFailedUserCreateData as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ---------------------------------------------
  // 로그인 (login)
  // ---------------------------------------------
  describe('user login', () => {
    it('should provide access token and user data when user is logging (로그인 성공)', async () => {
      const expectedServiceResult = {
        message: '로그인 성공',
        accessToken: fakeToken,
        user: {
          id: 1,
          email: 'test@email.com',
          nickname: 'tester',
          createdAt: '2025-01-01T10:00:00.000Z',
          updatedAt: '2025-01-01T10:00:00.000Z',
        },
      };
      //fake
      mockPrismaService.user.findUnique.mockResolvedValue(fakeUserDbResult);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(fakeToken);

      // real
      const result = await service.login(mockUserLoginData);
      expect(result).toEqual(expectedServiceResult);

      // 과정검증 1
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUserLoginData.email },
      });

      // 과정검증 2
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUserLoginData.password, // '1234'
        fakeHashedPassword, // 'db-에-저장된-해시비번-모양'
      );

      // 과정검증 3
      // accessToken 발급과정에서 올바른 정보를 불러냈나?
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: fakeUserDbResult.email,
        sub: fakeUserDbResult.id,
      });
    });

    it('should throw NotFoundException if user does not exist (로그인 실패 - 없는 유저)', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login(mockUserLoginData), // 2-1. '진짜 셰프' 연기 시작
      ).rejects.toThrow(UnauthorizedException); // 2-2. '에러'가 터지는지 검사

      // 3. "과정" 검증 (Then) - (선택 사항)
      // "혹시라도 토큰 발급기가 호출되진 않았겠지?" (당연히 안 됐어야 함)
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if password is not valid (로그인 실패 - 비번 틀림)', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(fakeUserDbResult);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // result
      await expect(service.login(mockUserLoginData)).rejects.toThrow(
        UnauthorizedException,
      );

      // process validation
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------
  // 유저 업데이트 (updateUser)
  // ---------------------------------------------
  describe('user update', () => {
    it('should return success when user is successfully updated (유저 업데이트 성공)', async () => {
      const paramUserId = 1;
      mockPrismaService.user.update.mockResolvedValue({
        ...fakeUserDbResult,
        email: mockUserUpdateData.email,
        nickname: mockUserUpdateData.nickname,
      });
      const expectedServiceResult = {
        id: mockLoginedPublicUser.id,
        email: mockUserUpdateData.email,
        nickname: mockUserUpdateData.nickname,
        createdAt: mockLoginedPublicUser.createdAt,
        updatedAt: mockLoginedPublicUser.updatedAt,
      };
      const result = await service.updateUser(
        paramUserId,
        mockLoginedPublicUser,
        mockUserUpdateData,
      );
      expect(result).toEqual(expectedServiceResult);

      //과정
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: paramUserId },
        data: mockUserUpdateData,
      });
    });

    it('should allow only the user to update their own profile (유저 업데이트 실패)', async () => {
      const paramUserId = 2; // axios.patch(user/2)
      await expect(
        service.updateUser(
          paramUserId,
          mockLoginedPublicUser, // login user ID = 1
          mockUserUpdateData,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
