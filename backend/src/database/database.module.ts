import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Knex from 'knex';
import knexConfig from '../../knexfile';

const configService = new ConfigService();
const environment = configService.get<string>('ENVIRONMENT') || 'development';

@Global()
@Module({
  providers: [
    {
      provide: 'KnexConnection',
      useFactory: async () => {
        return Knex(knexConfig[environment]);
      },
    },
  ],
  exports: ['KnexConnection'],
})
export class DatabaseModule {}
