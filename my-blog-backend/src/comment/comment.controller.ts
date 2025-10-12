import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

// usermodel type 생성
import { User } from 'src/user/decorator/user.decorater';
import type { AuthenticatedUser } from 'src/user/types/user,types';
@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post() 
  @UseGuards(AuthGuard('jwt')) // 당연히 로그인이 필요합니다.
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: AuthenticatedUser
  ) {
    return this.commentService.create(+postId, createCommentDto, user.id);
  }

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.commentService.findAll(+postId);
  }

  @Get(':commentId')
  findOne(@Param('commentId') commentid: string) {
    return this.commentService.findOne(+commentid);
  }

  // 댓글 수정 
  @Patch(':commentId')
  @UseGuards(AuthGuard('jwt')) 
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: AuthenticatedUser
  ) {
    return this.commentService.update(+commentId, updateCommentDto, user.id);
  }

  // 댓글 삭제
  @Delete(':commentId')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('commentId') commentId: string,
    @User() user: AuthenticatedUser
  ) {
    return this.commentService.remove(+commentId, user.id);
  }
}
