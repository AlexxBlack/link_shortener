import { Module } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { KnexModule } from 'nestjs-knex';
import { CacheModule } from '../cache/cache.module';

@Module({
    imports: [KnexModule, CacheModule],
    controllers: [ShortenerController],
    providers: [ShortenerService],
})
export class ShortenerModule {}
