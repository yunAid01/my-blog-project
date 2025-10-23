// src/user/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedUser } from './types/user,types';

@Injectable()
// PassportStrategy를 상속받아 JWT에 대한 '인증 전략'을 정의합니다.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      // 1. 요청의 헤더에서 'Bearer Token' 타입의 토큰을 추출하라고 설정합니다.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. 토큰이 만료되었을 경우, 요청을 거부하도록 설정합니다.
      ignoreExpiration: false,
      // process.env.JWT_SECRET이 'string' 타입이라고 우리가 보증(타입 단언)해줍니다.
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }
  // 4. 토큰 검증이 성공적으로 끝나면, 토큰의 payload가 이 메서드의 첫번째 인자로 전달됩니다.
  // 이 메서드의 반환값은 NestJS에 의해 요청(request) 객체에 'user'라는 이름으로 첨부됩니다.
  async validate(payload: {
    email: string;
    sub: number;
  }): Promise<AuthenticatedUser> {
    // payload의 sub(유저 id)를 사용해 실제 유저가 DB에 존재하는지 확인합니다.
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    // 보안상 password 필드는 제외하고 반환합니다.
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
