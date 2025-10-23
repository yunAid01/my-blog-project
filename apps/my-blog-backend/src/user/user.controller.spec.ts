import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

// dto
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

const mockUserService = {
  createUser: jest.fn(), // 굳
  login: jest.fn(),

  findUserPosts: jest.fn(),
  findUserLikedPosts: jest.fn(),
  findUserSavedPosts: jest.fn(),
  findUserForProfile: jest.fn(),
  updateUser: jest.fn(),
  removeUser: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController; // 🤵‍♂️ '진짜'
  let service: UserService; // 👨‍🍳 '가짜' (이름표만 UserService)
  let mockUserCreateData: CreateUserDto;
  let mockUserLoginData: LoginUserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService); // (이 변수엔 '가짜'가 담김)

    mockUserCreateData = {
      email: 'test@email.com',
      nickname: 'tester',
      password: '1234',
    };
    mockUserLoginData = {
      email: 'test@email.com',
      password: '1234',
    };
  });

  // (청소!)
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user and return it (회원가입)', async () => {
    const expectedreturnResult = {
      id: 1,
      email: 'test@email.com',
      nickname: 'tester',
      createdAt: '2025-01-01T10:00:00.000Z',
      updatedAt: '2025-01-01T10:00:00.000Z',
    };
    // 1. "대본" 쥐여주기 (Given)
    // "이봐 가짜 셰프! 'createUser'가 호출되면 'expectedPublicUserResult'를 줘!"
    (service.createUser as jest.Mock).mockResolvedValue(expectedreturnResult);

    // 2. "연기" 시작 (When)
    // '진짜 매니저'한테 '가짜 주문서'를 넘겨서 호출!
    const result = await controller.createUser(mockUserCreateData);

    // 3. "결과" 확인 (Then)
    // 3-1. (반환값 검증) 매니저가 '셰프가 준 음식'을 손님에게 잘 돌려줬나?
    expect(result).toEqual(expectedreturnResult);

    // 3-2. (주문서 검증) 매니저가 '셰프'를 "올바른 주문서"로 불렀나? (가장 중요!)
    expect(service.createUser).toHaveBeenCalledWith(mockUserCreateData);
  });

  it('should login with user login data (로그인 성공)', async () => {
    const expectedreturnResult = {
      message: '로그인 성공',
      accessToken: 'this-is-a-fake-token-string',
      user: {
        id: 1,
        email: 'test@email.com',
        nickname: 'tester',
        createdAt: '2025-01-01T10:00:00.000Z',
        updatedAt: '2025-01-01T10:00:00.000Z',
      },
    };

    // service => UserService
    (service.login as jest.Mock).mockResolvedValue(expectedreturnResult);
    const result = await controller.login(mockUserLoginData); // ㄹㅇ
    expect(result).toEqual(expectedreturnResult);
    expect(service.login).toHaveBeenCalledWith(mockUserLoginData);
  });
});
