import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        ConfigModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        KnexModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}