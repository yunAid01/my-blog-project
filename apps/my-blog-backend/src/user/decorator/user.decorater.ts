// src/user/decorator/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../types/user,types';

// createParamDecorator: 우리만의 커스텀 데코레이터를 만들 수 있게 해주는 함수
export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    // ExecutionContext로부터 http 요청(request) 객체를 꺼냅니다.
    const request = ctx.switchToHttp().getRequest();
    // request 객체 안에 있는 user 정보를 반환합니다. (AuthGuard가 넣어준 값)
    return request.user;
  },
);