import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

// jwt 인증
import { AuthGuard } from '@nestjs/passport'; // AuthGuard를 import 합니다.
import { UseGuards } from '@nestjs/common';

// userDecorator and userClass from prisma
import { User } from 'src/user/decorator/user.decorater';
import type { AuthenticatedUser } from 'src/user/types/user,types';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Post() 데코레이터는 HTTP POST 요청을 처리합니다.
  // 즉, 'POST /posts' 요청이 이 메서드로 들어옵니다.
  @Post()
  // @Body() 데코레이터는 요청의 본문(body)에 담겨온 JSON 데이터를
  // createPostDto 파라미터에 자동으로 넣어달라고 NestJS에 요청합니다.
  // 이때 CreatePostDto 타입을 지정해서, 들어온 데이터가 '주문서 양식'에 맞는지 확인합니다.
  @UseGuards(AuthGuard('jwt')) // <--- 이 경로에 '가드'를 배치합니다!
  create(
    @Body() createPostDto: CreatePostDto,
    @User() user: AuthenticatedUser
  ) {
    // 2. 홀 매니저가 손님의 주문서(DTO)를 그대로 주방 셰프에게 전달합니다.
    const userId = user.id;
    return this.postService.create(createPostDto, userId);
  }

  @Get() // HTTP GET 요청을 처리하는 '핸들러'입니다.
  // 즉, 'GET /posts' 요청이 들어오면 이 메서드가 실행됩니다.
  findAll() {
    // '홀 매니저'가 '주방 셰프'에게 "모든 메뉴 목록 주세요!" 라고 요청하는 부분입니다.
    return this.postService.findAll();
  }

  // @Get(':id') 데코레이터는 '/posts/' 뒤에 오는 동적인 값(:id)을 처리합니다.
  // 예를 들어, /posts/1, /posts/abc 등의 요청이 모두 이 핸들러로 들어옵니다.
  @Get(':id')
  // @Param('id')는 URL의 :id 부분에 들어온 값을 id라는 이름의 파라미터로 받겠다는 의미입니다.
  // URL에서 받은 id는 기본적으로 문자열(string) 타입입니다.
  findOne(@Param('id') id: string) {
    // 홀 매니저가 손님의 '1번 메뉴' 주문을 받고, 셰프에게 전달합니다.
    // 데이터베이스의 id는 숫자 타입이므로, '+'를 붙여 문자열 id를 숫자(number)로 변환해줍니다.
    return this.postService.findOne(+id);
  }
  
  // 'GET /posts/my' 라는 새로운 경로입니다.
  // 이 부분이 아마 누락되었을 수 있습니다.
  @Get('/my')
  @UseGuards(AuthGuard('jwt')) // 당연히 로그인이 필요합니다.
  findMyPosts(@User() user: AuthenticatedUser) {
    return this.postService.findMyPosts(user.id);
  }

  // @Patch(':id') 데코레이터는 HTTP PATCH 요청을 처리하며, 특정 리소스를 수정함을 의미합니다.
  @Patch(':id')
  // @Param으로 어떤 게시글을 수정할지 id를, @Body로 어떤 내용으로 수정할지 DTO를 함께 받습니다.
  @UseGuards(AuthGuard('jwt')) // 당연히 로그인이 필요합니다.
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    // 2. 홀 매니저가 손님의 '1번 메뉴 수정 요청서'를 셰프에게 전달합니다.
    return this.postService.update(+id, updatePostDto);
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
