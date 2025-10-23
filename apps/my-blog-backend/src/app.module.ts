import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module'; // 1. PrismaModule을 import 합니다.
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    PostModule,
    PrismaModule,
    UserModule,
    CommentModule,
    LikeModule,
    FollowModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
