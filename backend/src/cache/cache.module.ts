import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { createClient } from 'redis';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: async () => {
                const client = createClient({ url: process.env.REDIS_URL });
                await client.connect();
                return client;
            },
        },
        CacheService,
    ],
    exports: ['REDIS_CLIENT', CacheService],
})
export class CacheModule {}
