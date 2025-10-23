import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { PostService } from 'src/post/post.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get() // search?q=keyword
  @UseGuards(AuthGuard('jwt'))
  search(@Query('q') keyword: string) {
    return this.searchService.searchPosts(keyword);
  }
}
