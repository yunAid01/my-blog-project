import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

// real
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'; // 1. '진짜 토큰 발급기' 설계도 import

import { ConflictException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};
// --- 🎟️ '가짜 토큰 발급기' 만들기 ---
const mockJwtService = {
  sign: jest.fn(),
  // (필요한 함수가 더 있으면 나중에 추가)
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('새로운 유저를 생성해야 한다. (회원가입 성공', async () => {
    const mockUserCreateData = {
      email: 'test@email.com',
      nickname: 'testnickname',
      password: '1234',
    }
    const fakeHashedPassword = 'db-에-저장된-해시비번-모양';
    const fakeDbResult = {
      id: 1,
      email: 'test@email.com',
      nickname: 'testnickname',
      password: fakeHashedPassword,
      // '가짜 날짜 객체' (Date Object)를 넣어줍니다!
      createdAt: new Date('2025-01-01T10:00:00.000Z'), 
      updatedAt: new Date('2025-01-01T10:00:00.000Z'),
    }
    const expectedServiceResult = {
      id: 1,
      email: 'test@email.com',
      nickname: 'testnickname',
      createdAt: '2025-01-01T10:00:00.000Z',
      updatedAt: '2025-01-01T10:00:00.000Z',
    };

    // 대본 쥐어주기
    // "이봐 가짜 농부! 'user.create'가 호출되면, 'fakeDbResult'(비번 포함된)를 줘!"
    mockPrismaService.user.create.mockResolvedValue(fakeDbResult);

    // '진짜' 셰프의 로직이 100% 실행됩니다:
    // (1) '진짜' bcrypt.hash('1234') 실행
    // (2) '가짜' prisma.user.create( { data: { ..., password: '해시된값' } } ) 호출
    // (3) '가짜' prisma가 'fakeDbResult'(해시 비번 포함) 반환
    // (4) '진짜' 셰프 로직이 'fakeDbResult.password'를 delete
    // (5) '진짜' 셰프 로직이 'toISOString()' 호출
    const result = await service.create(mockUserCreateData)

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
});
