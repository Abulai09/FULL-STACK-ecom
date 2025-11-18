import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default',
    });
  }

  async validate(payload: any) {
    const user = await this.userRepo.findOne({ where: { id: payload.id } });
    if (!user) throw new UnauthorizedException('Unauthorized');

    if (user.sessionVersion !== payload.sessionVersion)
      throw new UnauthorizedException('Unauthorized');

    return {
      id: payload.id,
      username: payload.username,
      sessionVersion: payload.sessionVersion,
      role: payload.role,
    };
  }
}
