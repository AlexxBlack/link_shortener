import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @Inject('KnexConnection') private readonly knex: Knex,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.knex('users').where({ email }).first();
        if (user && (await bcrypt.compare(password, user.password_hash))) {
            return { id: user.id, email: user.email };
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await this.knex('users').select('id').where({ email }).first();
        if(existingUser){
            throw new BadRequestException(`User with email ${email} already exists`);
        }
        const [user] = await this.knex('users').insert({ email, password_hash: hashedPassword }).returning(['id', 'email']);
        return user;
    }
}