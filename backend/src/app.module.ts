import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortenerModule } from './shortener/shortener.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { ShortenerService } from './shortener/shortener.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule,
    AuthModule,
    ShortenerModule,
    DatabaseModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    ShortenerService,
  ]
})
export class AppModule {}
