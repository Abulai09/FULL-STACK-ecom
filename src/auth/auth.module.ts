import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwtStrategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Token } from 'src/token/token.entity';
import { TokenModule } from 'src/token/token.module';
import { RedisModule } from 'src/redis/redis.module';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    TokenModule,
    RedisModule,
    SmsModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
