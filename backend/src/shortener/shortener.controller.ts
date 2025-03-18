import { Controller, Post, Body, Get, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shortener')
export class ShortenerController {
    constructor(private readonly shortenerService: ShortenerService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createShortLink(@Request() req, @Body('url') url: string, @Body('customSlug') customSlug?: string) {
        try {
            const userId = req.user?.userId;
            const slug = await this.shortenerService.createShortLink(url, userId, customSlug);
            return { shortUrl: `${process.env.BASE_URL}/${slug}` };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('user/links')
    @UseGuards(JwtAuthGuard)
    async getUserLinks(@Request() req) {
        return this.shortenerService.getUserLinks(req.user.userId);
    }
}
