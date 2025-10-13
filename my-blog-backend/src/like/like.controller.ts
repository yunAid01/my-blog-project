import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/decorator/user.decorater';
import type { AuthenticatedUser } from 'src/user/types/user,types';

@Controller('posts/:postId/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // 좋아요 추가하기
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Param('postId') postId: string, @User() user: AuthenticatedUser) {
    return this.likeService.create(+postId, user.id);
  }

  // 좋아요 카운트 및 포스트 좋아요 조회
  @Get()
  findAll() {
    return this.likeService.findAll();
  }ㄴ

  // 좋아요 취소하기
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('postId') postId: string, @User() user: AuthenticatedUser) {
    return this.likeService.remove(+postId, user.id);
  }
}
