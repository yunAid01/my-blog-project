// src/prisma/prisma.service.ts

// Injectable: 이 클래스를 다른 곳에 '주입'할 수 있게 만들어주는 NestJS 데코레이터
// OnModuleInit: 모듈이 초기화될 때 실행할 메서드를 강제하는 인터페이스
import { Injectable, OnModuleInit } from '@nestjs/common';
// PrismaClient: 데이터베이스와 상호작용하는 핵심 클래스
import { PrismaClient } from '@prisma/client';

@Injectable()
// PrismaClient를 상속받아서, 데이터베이스에 접근하는 모든 메서드(find, create 등)를 물려받습니다.
export class PrismaService extends PrismaClient implements OnModuleInit {
  // onModuleInit()는 모듈이 로드될 때 단 한번만 실행되는 NestJS의 생명주기(lifecycle) 훅입니다.
  // 이 시점에 데이터베이스에 연결하는 것이 가장 이상적입니다.
  async onModuleInit() {
    // this.$connect()는 PrismaClient 클래스로부터 물려받은 메서드입니다.
    // 이 메서드를 호출하여 데이터베이스와 연결을 맺습니다.
    await this.$connect();
    console.log('🎉 The database has been successfully connected!');
  }
}
