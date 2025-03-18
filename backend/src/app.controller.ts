import { Controller, Get, Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ShortenerService } from './shortener/shortener.service';

@Controller()
export class AppController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Get(':slug')
  async redirectToOriginal(@Param('slug') slug: string, @Res() res: Response) {
    const originalUrl = await this.shortenerService.getOriginalUrl(slug);
    if (!originalUrl) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return res.redirect(originalUrl);
  }
}
