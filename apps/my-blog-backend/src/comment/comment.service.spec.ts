import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CommentService', () => {
  let service: CommentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService,
        {
          provide: PrismaService, 
          useValue: { // 가짜 PrismaService 객체를 만듭니다.
            comment: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            }
          }
        }
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prisma = module.get<PrismaService>(PrismaService);// 가짜 PrismaService 주입
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new comments', async () => {
    const userId = 1;
    const postId = 1;
    const mockCreateCommentDto = {
      text: "this is my firt comment"
    };

    const mockCreatedComment = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: userId,
      text: mockCreateCommentDto.text,
      postId: postId
    };

    // PrismaService의 create 메서드가 호출될 때, mockCreatedComment를 반환하도록 설정
    jest.spyOn(prisma.comment, 'create').mockResolvedValue(mockCreatedComment);

    // 서비스의 create 메서드를 호출
    const result = await service.create(postId, mockCreateCommentDto, userId);

    // 결과가 예상한 값과 일치하는지 확인
    expect(result).toEqual(mockCreatedComment);

    // PrismaService의 create 메서드가 올바른 인수로 호출되었는지 확인
    expect(prisma.comment.create).toHaveBeenCalledWith({
      data: {
        text: mockCreateCommentDto.text,
        authorId: userId,
        postId: postId,
      },
    });
  })
});
