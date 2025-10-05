// src/prisma/prisma.module.ts

// Global: 이 모듈을 '전역 모듈'로 만들어주는 데코레이터
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 이 데코레이터 하나로 PrismaModule은 어디서든 사용할 수 있게 됩니다.
@Module({
  // providers: 이 모듈에서 사용할 서비스들을 등록합니다.
  // NestJS가 PrismaService를 인식하고 다른 곳에 주입(Inject)할 수 있게 됩니다.
  providers: [PrismaService],
  // exports: 이 모듈이 외부로 '수출'하여 다른 모듈에게 제공할 서비스를 명시합니다.
  // 즉, 다른 모듈에서 PrismaService를 사용할 수 있도록 공개하는 것입니다.
  exports: [PrismaService],
})
export class PrismaModule {}