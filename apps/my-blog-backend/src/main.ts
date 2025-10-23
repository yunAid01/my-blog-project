import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. 앱 전체에 적용될 글로벌 파이프를 설정합니다.
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true 로 설정하면, DTO에 정의되지 않은 프로퍼티는
      // 요청 자체에서 자동으로 걸러지고 제거됩니다.
      whitelist: true,

      // forbidNonWhitelisted: true 로 설정하면, DTO에 없는 프로퍼티가 요청에 포함될 경우
      // 아예 요청 자체를 막고 400 Bad Request 에러를 발생시킵니다. (더 안전함)
      forbidNonWhitelisted: true,

      // transform: true 로 설정하면, 네트워크를 통해 들어온 데이터를
      // 우리가 DTO에 정의한 실제 타입으로 변환해줍니다.
      // 예: URL의 파라미터로 들어온 문자열 '1'을 숫자 1로 자동 변환.
      transform: true,
    }),
  );

  // --- [이 줄을 추가해주세요!] ---
  // enableCors()를 호출하면, 기본적으로 모든 출처(Origin)에서의 요청을 허용하게 됩니다.
  // 개발 환경에서는 보통 이렇게 넓게 설정하고,
  // 실제 서비스 배포 시에는 { origin: 'https://내-실제-도메인.com' } 와 같이 특정 출처만 허용합니다.
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
