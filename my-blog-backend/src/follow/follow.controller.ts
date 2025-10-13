import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
  create(@Param('userId') followedUser: string, @User() user: AuthenticatedUser) {
    return this.followService.create(+followedUser, user.id);
  }

  @Get()
  findAll() {
    return this.followService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followService.findOne(+id);
  }

  // 언팔로우하기
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('userId') followedUser: string,
    @User() user: AuthenticatedUser
  ) {
    return this.followService.remove(+followedUser, user.id);
  }
}
