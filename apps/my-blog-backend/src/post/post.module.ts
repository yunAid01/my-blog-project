import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserModule } from 'src/user/user.module'; // 1. PassportModule 대신 UserModule을 import 합니다.


@Module({
  imports: [UserModule], // 2. imports 배열에 PassportModule을 추가합니다.
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
