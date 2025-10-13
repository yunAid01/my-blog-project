import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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

  @Get(':id')
  findOne(@Param('id') userId: string) {
    return this.userService.findUserWithAllData(+userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // JWT 인증 가드를 적용합니다.
  update(
    @Param('id') userId: string,
    @User() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(+userId, user, updateUserDto);
  }

  // 유저 회원 삭제
  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // JWT 인증 가드를 적용합니다.
  remove(
    @Param('id') id: string,
    @User() user: AuthenticatedUser
  ) {
    return this.userService.remove(+id, user);
  }
}
