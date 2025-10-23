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
d;
// DI
import { UserService } from './user.service';

// DTO
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { AuthGuard } from '@nestjs/passport';
import { User } from './decorator/user.decorater';
import type { AuthenticatedUser } from './types/user,types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /user 요청을 처리합니다.(create User)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // 'POST /user/login' 경로로 요청을 받습니다. (login User)
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id/me')
  @UseGuards(AuthGuard('jwt'))
  findMe(@Param('id') userId: string) {
    return this.userService.findMe(+userId);
  }

  @Get(':id/posts')
  findUserPosts(@Param('id') userId: string) {
    return this.userService.findUserPosts(+userId);
  }

  @Get(':id/likes')
  findUserLikedPosts(@Param('id') userId: string) {
    return this.userService.findUserLikedPosts(+userId);
  }

  @Get(':id/saved')
  findUserSavedPosts(@Param('id') userId: string) {
    return this.userService.findUserSavedPosts(+userId);
  }

  @Get(':id')
  /** user for profile */
  findUserForProfile(@Param('id') userId: string) {
    return this.userService.findUserForProfile(+userId);
  }

  // user/:id
  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // JWT 인증 가드를 적용합니다.
  updateUser(
    @Param('id') userId: string,
    @User() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(+userId, user, updateUserDto);
  }

  // 유저 회원 삭제
  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // JWT 인증 가드를 적용합니다.
  removeUser(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.userService.removeUser(+id, user);
  }
}
