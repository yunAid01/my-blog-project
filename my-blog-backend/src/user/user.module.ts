import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt'; // JwtModule을 import 합니다.

// jwt
import { PassportModule } from '@nestjs/passport'; // 1. PassportModule import
import { JwtStrategy } from './jwt.strategy'; // 2. JwtStrategy import

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // 3. PassportModule 등록
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy], // 4. providers에 JwtStrategy 추가
  exports: [JwtStrategy, PassportModule], // 5. 다른 모듈에서 사용할 수 있도록 exports
})
export class UserModule {}
