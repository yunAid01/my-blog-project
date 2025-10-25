import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

// jwt 인증
import { AuthGuard } from '@nestjs/passport'; // AuthGuard를 import 합니다.
import { UseGuards } from '@nestjs/common';

// userDecorator and userClass from prisma
import { User } from 'src/user/decorator/user.decorater';
import type { AuthenticatedUser } from 'src/user/types/user.types';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // <--- 이 경로에 '가드'를 배치합니다!
  create(
    @Body() createPostDto: CreatePostDto,
    @User() user: AuthenticatedUser,
  ) {
    // 2. 홀 매니저가 손님의 주문서(DTO)를 그대로 주방 셰프에게 전달합니다.
    const userId = user.id;
    return this.postService.create(createPostDto, userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  // ------------------ edit page  ------------------- //
  @Get(':id/edit')
  @UseGuards(AuthGuard('jwt'))
  findOneForEdit(@Param('id') postId: string) {
    return this.postService.findOneForEdit(+postId);
  }

  // @Patch(':id') 데코레이터는 HTTP PATCH 요청을 처리하며, 특정 리소스를 수정함을 의미합니다.
  @Patch(':id/edit')
  // @Param으로 어떤 게시글을 수정할지 id를, @Body로 어떤 내용으로 수정할지 DTO를 함께 받습니다.
  @UseGuards(AuthGuard('jwt')) // 당연히 로그인이 필요합니다.
  async update(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    // 2. 홀 매니저가 손님의 '1번 메뉴 수정 요청서'를 셰프에게 전달합니다.
    const updatedPost = await this.postService.update(+postId, updatePostDto);
    return updatedPost;
  }

  // @Delete(':id') 데코레이터는 HTTP DELETE 요청을 처리합니다.
  @Delete(':id')
  // 삭제할 게시글의 id를 URL 파라미터로 받습니다.
  @UseGuards(AuthGuard('jwt')) // 당연히 로그인이 필요합니다.
  remove(@Param('id') id: string) {
    // 홀 매니저가 '1번 메뉴 주문 취소' 요청을 셰프에게 전달합니다.
    return this.postService.remove(+id);
  }
}
