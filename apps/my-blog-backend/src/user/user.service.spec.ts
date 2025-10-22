import { Test, TestingModule } from '@nestjs/testing';

// user dto
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

// real
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'; // 1. '진짜 토큰 발급기' 설계도 import
import * as bcrypt from 'bcrypt'; // 1. '진짜' bcrypt 가져오기

import { ConflictException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserTabPost } from '@my-blog/types';


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

  // --- 👇 "가짜 데이터" 그릇 준비! (let) ---
  // 이 변수들은 모든 'it' 블록에서 재사용됩니다.
  let mockUserCreateData: CreateUserDto;
  let mockUserLoginData: LoginUserDto;
  let fakeHashedPassword: string;
  let fakeUserDbResult;
  let fakeToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService, // 주인공(진짜 로직)
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        }
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
    fakeUserDbResult = {
      id: 1,
      email: 'test@email.com',
      nickname: 'tester',
      password: fakeHashedPassword,
      createdAt: new Date('2025-01-01T10:00:00.000Z'),
      updatedAt: new Date('2025-01-01T10:00:00.000Z'),
    };
  });

  // (afterEach 추가 - 필수!)
  afterEach(() => {
    jest.clearAllMocks(); // '가짜' 배우들의 메모리를 깨끗이 청소!
  });
  

  it('should be defined (정의 되어야 함)', () => {
    expect(service).toBeDefined();
  });

  it('should create new user with register data (회원가입 성공)', async () => {
    const expectedServiceResult = {
      id: 1,
      email: 'test@email.com',
      nickname: 'tester',
      createdAt: '2025-01-01T10:00:00.000Z',
      updatedAt: '2025-01-01T10:00:00.000Z',
    };

    // 🚨 '가짜 bcrypt.hash'도 대본을 줘야 합니다! (안 그럼 'undefined' 반환)
    (bcrypt.hash as jest.Mock).mockResolvedValue(fakeHashedPassword);
    // 대본 쥐어주기
    // "이봐 가짜 농부! 'user.create'가 호출되면, 'fakeDbResult'(비번 포함된)를 줘!"
    mockPrismaService.user.create.mockResolvedValue(fakeUserDbResult);

    // '진짜' 셰프의 로직이 100% 실행됩니다:
    // (1) '진짜' bcrypt.hash('1234') 실행
    // (2) '가짜' prisma.user.create( { data: { ..., password: '해시된값' } } ) 호출
    // (3) '가짜' prisma가 'fakeDbResult'(해시 비번 포함) 반환
    // (4) '진짜' 셰프 로직이 'fakeDbResult.password'를 delete
    // (5) '진짜' 셰프 로직이 'toISOString()' 호출
    const result = await service.createUser(mockUserCreateData)

    // 4. 결과 확인! (Then)
    // 4-1. ['반환' 검증]
    //      셰프가 내놓은 '최종 요리(result)'가
    //      '최종 기대 요리(expectedServiceResult)'와 똑같은가? (즉, 비번이 제거됐나?)
    expect(result).toEqual(expectedServiceResult);

    // 4-2. [셰프의 '과정' 검증] (더 중요!)
    //      셰프가 '가짜 농부'를 부를 때(create),
    //      혹시 '평문 비번(1234)'을 그대로 넘기진 않았나? (해시를 잘 했나?)
    expect(mockPrismaService.user.create).toHaveBeenCalledWith({
      data: {
        email: mockUserCreateData.email,
        nickname: mockUserCreateData.nickname,
        // "비밀번호는 '1234'가 아닌(not.stringContaining),
        //  '어떤 문자열(any(String))'이 들어갔어야 해!"
        password: expect.not.stringContaining(mockUserCreateData.password) as string,
      },
    });
  })

  // ------------------ 직접 고민해봄 -------------------- //
  it('should have email & password & nickname data for register (회원가입 실패)', async () => {
    const mockFailedUserCreateData = { // 일부러 틀린 데이터 넣음
      email: 'test@email.com',
      password: '1234'
    }
    await expect(
      service.createUser(mockFailedUserCreateData as any),
    ).rejects.toThrow(ForbiddenException);
  })

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
      }
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
    // 1. "대본" 쥐여주기 (Given)
    // "이봐 가짜 농부! findUnique가 호출되면 '없다(null)'고 말해!"
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    // 2. "연기" 시작 & "결과" 확인 (When & Then)
    // '진짜 셰프'가 login을 실행하면, 
    // '거절(rejects)'할 것이고, 
    // 그 이유가 'NotFoundException'이 맞는지 확인해!
    await expect(
      service.login(mockUserLoginData), // 2-1. '진짜 셰프' 연기 시작
    ).rejects.toThrow(NotFoundException); // 2-2. '에러'가 터지는지 검사

    // 3. "과정" 검증 (Then) - (선택 사항)
    // "혹시라도 토큰 발급기가 호출되진 않았겠지?" (당연히 안 됐어야 함)
    expect(mockJwtService.sign).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if password is not valid (로그인 실패 - 비번 틀림)', async () => {
    // 1. "대본" 쥐여주기 (Given)
    // 1-1. '가짜 농부' 대본: "유저는 찾았어!" (beforeEach에서 준비한 fakeDbResult 사용)
    mockPrismaService.user.findUnique.mockResolvedValue(fakeUserDbResult);

    // 1-2. '가짜 bcrypt' 대본: "비밀번호 비교해봤는데? '실패(false)'야!"
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    // 2. "연기" 시작 & "결과" 확인 (When & Then)
    // "셰프가 login을 실행하면, UnauthorizedException 에러를 던져야 해!"
    await expect(service.login(mockUserLoginData)).rejects.toThrow(
      UnauthorizedException,
    );

    // 3. "과정" 검증 (Then)
    // "비번이 틀렸으니까, 토큰 발급기(jwtService.sign)는 절대 호출되면 안 돼!"
    expect(mockJwtService.sign).not.toHaveBeenCalled();
  });
})