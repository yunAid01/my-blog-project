import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DmService } from './dm.service';
import { CreateDmDto } from './dto/create-dm.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/decorator/user.decorater';
import type { AuthenticatedUser } from 'src/user/types/user.types';

@UseGuards(AuthGuard('jwt')) // DM 기능은 로그인 필수
@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  // 대화방 초대할 사람들 찾기 내가 팔로우한 사람들
  @Get('followings')
  getDmFollowings(@User() user: AuthenticatedUser) {
    return this.dmService.getDmFollowings(+user.id);
  }

  // 대화방 가져오기
  @Get('conversations')
  getConservations(@User() user: AuthenticatedUser) {
    return this.dmService.getConversations(+user.id);
  }

  // 대화방 생성하기
  @Post('conversations')
  createConservation(
    @User() user: AuthenticatedUser,
    @Body() recipientId: number[],
  ) {
    return this.dmService.createConservation(user.id, recipientId);
  }

  // 1. 특정 대화방의 '과거 메시지'를 싹 가져오는 API
  @Get('conversations/:id/messages')
  getMessages(@Param('id') conversationId: string) {
    return this.dmService.getMessages(+conversationId);
  }

  // 메세지 생성
  @Post('conversations/:id/messages')
  createMessage(
    @Param('id') conversationId: string,
    @User() sender: AuthenticatedUser,
    @Body() createDmDto: CreateDmDto,
  ) {
    return this.dmService.createMessage(
      +conversationId, // 대화방
      +sender.id, // 보낸사람
      createDmDto, // 텍스트
    );
  }
}
