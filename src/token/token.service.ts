import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
    private readonly jwtServ: JwtService,
  ) {}

  generateWebTokens(payload: any): {
    accessToken: string;
    refreshToken: string;
  } {
    console.log(payload);
    const accessToken = this.jwtServ.sign(
      {
        id: payload.id,
        username: payload.username,
        phoneNumber: payload.phoneNumber,
        sessionVersion: payload.sessionVersion,
        role: payload.role,
      },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtServ.sign(
      {
        id: payload.id,
        username: payload.username,
        phoneNumber: payload.phoneNumber,
        sessionVersion: payload.sessionVersion,
        role: payload.role,
      },
      { secret: process.env.JWT_REFRESH, expiresIn: '2d' },
    );
    return { accessToken, refreshToken };
  }

  async saveToken(refreshToken: string, userId: number) {
    try {
      const hashToken = await bcrypt.hash(refreshToken, 10);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 2);
      const existing = await this.tokenRepo.findOne({
        where: { userId },
        relations: ['user'],
      });
      if (existing) {
        existing.hashedToken = hashToken;
        existing.expiresIn = expiresAt;
        existing.revoked = false;
        return await this.tokenRepo.save(existing);
      }

      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new UnauthorizedException('Unauthorized!');

      const newTokens = this.tokenRepo.create({
        hashedToken: hashToken,
        expiresIn: expiresAt,
        user,
        userId,
      });
      return await this.tokenRepo.save(newTokens);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async removeToken(userId: number) {
    try {
      const token = await this.tokenRepo.findOne({ where: { userId } });
      if (!token) throw new UnauthorizedException('Unauthorized!');

      token.revoked = true;
      await this.tokenRepo.save(token);
      return { message: 'logged out' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async refreshToken(oldToken: string) {
    try {
      const payload = await this.jwtServ.verify(oldToken, {
        secret: process.env.JWT_REFRESH,
      });
      const { id: userId } = payload;

      const savedInDb = await this.tokenRepo.findOne({ where: { userId } });
      if (!savedInDb || savedInDb.revoked)
        throw new UnauthorizedException('Unauthorized!');

      if (savedInDb.expiresIn < new Date()) {
        throw new UnauthorizedException('Refresh token expired!');
      }

      const isMatch = await bcrypt.compare(oldToken, savedInDb.hashedToken);
      if (!isMatch) throw new UnauthorizedException('Unauthorized!');

      savedInDb.revoked = true;
      await this.tokenRepo.save(savedInDb);

      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new UnauthorizedException('Unauthorized!');

      const newTokens = this.generateWebTokens({
        id: user.id,
        username: user.username,
        sessionVersion: user.sessionVersion,
      });
      await this.saveToken(newTokens.refreshToken, userId);
      return { newTokens };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
