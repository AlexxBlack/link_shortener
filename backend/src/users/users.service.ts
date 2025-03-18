import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class UsersService {
    constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

    async findOneByEmail(email: string) {
        return this.knex('users').where({ email }).first();
    }

    async createUser(email: string, passwordHash: string) {
        return this.knex('users').insert({ email, password_hash: passwordHash }).returning(['id', 'email']);
    }
}
