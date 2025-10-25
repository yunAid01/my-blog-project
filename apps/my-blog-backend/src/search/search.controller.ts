import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedUser } from 'src/user/types/user.types';
import { User } from 'src/user/decorator/user.decorater';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('posts') // search/posts
  @UseGuards(AuthGuard('jwt'))
  getPostsForSearchPage(@User() user: AuthenticatedUser) {
    const userId: number = user.id;
    return this.searchService.getPostsForSearchPage(userId);
  }

  @Get('result') // search?q=keyword
  @UseGuards(AuthGuard('jwt'))
  search(@Query('q') keyword: string) {
    return this.searchService.searchPosts(keyword);
  }
}
