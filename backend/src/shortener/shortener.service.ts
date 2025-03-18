import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { CacheService } from '../cache/cache.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ShortenerService {
    constructor(
        @Inject('KnexConnection') private readonly knex: Knex,
        private readonly cacheService: CacheService
    ) {}

    private generateSlug(length = 6): string {
        return randomBytes(length)
          .toString('base64')
          .replace(/[^a-zA-Z0-9]/g, '')
          .slice(0, length);
    }

    async createShortLink(url: string, userId?: string, customSlug?: string): Promise<string> {
        const slug = customSlug || this.generateSlug(6);
        const exists = await this.knex('short_links').where({ slug }).first();

        if (exists) {
            throw new Error('Slug already exists');
        }

        await this.knex('short_links').insert({
            slug,
            original_url: url,
            user_id: userId || null,
            visit_count: 0,
        });
        return slug;
    }

    async getOriginalUrl(slug: string): Promise<string | null> {
        let link = await this.cacheService.getCache(slug);

        if (!link) {
            const dbLink = await this.knex('short_links').where({ slug }).first();
            if (dbLink) {
                await this.knex('short_links').where({ slug }).increment('visit_count', 1);
                await this.cacheService.setCache(slug, dbLink.original_url, 3600);
                link = dbLink.original_url;
            }
        }

        return link;
    }

    async getUserLinks(userId: string) {
        return this.knex('short_links')
            .where({ user_id: userId })
            .select('slug', 'original_url', 'visit_count', 'created_at');
    }
}