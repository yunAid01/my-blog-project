import { Injectable } from '@nestjs/common';

// apps/my-blog-backend/src/dm/dm.service.ts
import { PrismaService } from 'src/prisma/prisma.service';
import { Message, Conversation, PublicUser } from '@my-blog/types';
import { CreateDmDto } from './dto/create-dm.dto';

@Injectable()
export class DmService {
  constructor(private readonly prisma: PrismaService) {}

  // -----------------------------------------------------------------
  /** 대화방 초대할 팔로잉 사람들 찾기 */
/** 대화방 초대할 팔로잉 사람들 찾기 */
  async getDmFollowings(userId: number): Promise<PublicUser[]> {
    const followings = await this.prisma.follow.findMany({
      where: {
        followerId: userId, // 1. '내가'(followerId) 팔로우하는 관계를 찾음 (이건 맞음)
      },
      // 2. 'include' 대신 'select'를 사용합니다.
      select: {
        // 3. 'follower'(나)가 아닌, 'following'(내가 팔로우하는 상대방) 정보를 선택합니다.
        following: {
          // 4. [핵심] 'following' 유저 객체에서
          //    'password'를 제외한 PublicUser에 필요한 필드만 'true'로 지정합니다.
          select: {
            id: true,
            nickname: true,
            email: true,
            createdAt: true, // 6. 날짜 변환을 위해 날짜 필드도 가져옵니다.
            updatedAt: true,
          },
        },
      },
    });

    const users = followings.map((f) => ({
      ...f.following,
      createdAt: f.following.createdAt.toISOString(),
      updatedAt: f.following.updatedAt.toISOString(),
    }));
    return users;
  }

  // -----------------------------------------------------------------
  /** 대화방 가져오기 */
  async getConversations(userId: number): Promise<Conversation[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        // 최근에 업데이트된 대화방을 위로
        updatedAt: 'desc',
      },
    });
    return conversations.map((conversation) => ({
      ...conversation,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    }));
  }

  // -----------------------------------------------------------------
  /** 대화방 생성하기 */
  async createConservation(
    userId: number,
    recipientId: number[],
  ): Promise<Conversation> {
    const participantsId = [userId, ...recipientId];
    // 3. [1, 5, 8] 배열을 Prisma가 connect에서 사용하는
    //    [{ id: 1 }, { id: 5 }, { id: 8 }] 형태로 변환합니다.
    const connectOperations = participantsId.map((userId) => ({
      id: userId,
    }));

    const newConversation = await this.prisma.conversation.create({
      data: {
        participants: {
          connect: connectOperations,
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    return {
      ...newConversation,
      createdAt: newConversation.createdAt.toISOString(),
      updatedAt: newConversation.updatedAt.toISOString(),
    };
  }

  // -----------------------------------------------------------------
  /** 특정 대화방 메세지 모두 가져오기 */
  async getMessages(conversationId: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { conversationId }, // 특정 대화방
      orderBy: { createdAt: 'asc' }, // 오래된 순으로
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
          },
        },
      }, // 보낸 사람 정보 포함
    });
    return messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    }));
  }

  // -----------------------------------------------------------------
  /** 특정 대화방에서 메세지 생성하기 */
  async createMessage(
    senderId: number,
    conversationId: number,
    createDmDto: CreateDmDto,
  ): Promise<Message> {
    const newMessage = await this.prisma.message.create({
      data: {
        text: createDmDto.text,
        senderId,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
          },
        },
      }, // 프론트에 바로 보내주기 위해
    });
    return {
      ...newMessage,
      createdAt: newMessage.createdAt.toDateString(),
    };
  }
}
