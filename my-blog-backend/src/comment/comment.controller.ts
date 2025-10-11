import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

// usermodel type 생성
import type { User as UserModel } from '@prisma/client'; // 2. Prisma가 생성한 User 타입을 import
import { User } from 'src/user/decorator/user.decorater';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post() 
  @UseGuards(AuthGuard('jwt')) // 당연히 로그인이 필요합니다.
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: UserModel
  ) {
    return this.commentService.create(+postId, createCommentDto, user.id);
  }

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.commentService.findAll(+postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
