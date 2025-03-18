import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {}

    async setCache(key: string, value: string, ttl: number) {
        await this.redisClient.setEx(key, ttl, value);
    }

    async getCache(key: string): Promise<string | null> {
        return this.redisClient.get(key);
    }

    async deleteCache(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}
