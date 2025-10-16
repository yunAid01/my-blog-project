// packages/types/src/index.ts

// Prisma가 생성한 모든 타입을 가져와서 그대로 재수출!
export * from '@prisma/client'; 

// 기존에 있던 프론트엔드용 타입들도 export 합니다.
export * from './auth';
export * from './post';
export * from './user';
// ... 다른 타입 파일들