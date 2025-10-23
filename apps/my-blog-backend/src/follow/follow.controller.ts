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
import { FollowService } from './follow.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/decorator/user.decorater';
import type { AuthenticatedUser } from 'src/user/types/user,types';

@Controller('user/:userId/follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // 팔로우하기
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Param('userId') followingId: string, // 팔로우 당하는 사람
    @User() user: AuthenticatedUser, // 팔로우 하는 사람
  ) {
    return this.followService.create(+followingId, user.id);
  }

  // 언팔로우하기
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('userId') followingId: string, // 언팔로우 당하는 사람
    @User() user: AuthenticatedUser,
  ) {
    return this.followService.remove(+followingId, user.id);
  }
}
