import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/token/token.entity';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { userDto } from './dto/userDto';
import * as bcrypt from 'bcrypt';
import { SmsService } from 'src/sms/sms.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenServ: TokenService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
    private readonly smsServ: SmsService,
    private readonly redisServ: RedisService,
  ) {}

  async generateAndSaveToken(user: any) {
    const payload = {
      id: user.id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      sessionVersion: user.sessionVersion,
      role: user.role,
    };
    const tokens = this.tokenServ.generateWebTokens(payload);
    await this.tokenServ.saveToken(tokens.refreshToken, user.id);
    return tokens;
  }

  async registration(dto: userDto) {
    try {
      const candidate = await this.userRepo.findOne({
        where: { username: dto.username },
      });
      if (candidate)
        throw new BadRequestException('user with this email already exists');

      const hashPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.userRepo.save(
        this.userRepo.create({
          username: dto.username,
          phoneNumber: dto.phoneNumber,
          password: hashPassword,
          sessionVersion: 1,
          role: dto.role ?? 'user',
        }),
      );

      const tokens = await this.generateAndSaveToken(user);
      return tokens;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async login(phoneNumber: string, username: string, password: string) {
    try {
      const user = await this.userRepo.findOne({ where: { username } });
      if (!user) throw new UnauthorizedException('Invalid password or name!');

      // Лимит попыток неверного пароля
      const loginAttemptsKey = `${username}:login_failures`;
      const loginAttemptsStr = await this.redisServ.get(loginAttemptsKey);
      const loginAttempts = parseInt(loginAttemptsStr ?? '0');

      if (loginAttempts >= 5) {
        throw new UnauthorizedException(
          'Слишком много попыток входа. Попробуйте позже.',
        );
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        await this.redisServ.set(
          loginAttemptsKey,
          (loginAttempts + 1).toString(),
          60, // 5 минут блокировки
        );
        throw new UnauthorizedException('Invalid password or name!');
      }

      // Очистить счётчик неверных паролей при успехе
      await this.redisServ.del(loginAttemptsKey);

      // Проверка: код уже отправляли
      const existing = await this.redisServ.get(phoneNumber);
      if (existing)
        throw new BadRequestException(
          'Код уже отправлен, повторите через минуту.',
        );

      // Генерация кода
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await this.smsServ.sendSMS(phoneNumber, code);

      await this.redisServ.set(username, code, 60);

      return { message: 'Код отправлен' };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async verifyLoginCode(username: string, code: string) {
    const saved = await this.redisServ.get(username);
    if (!saved) throw new UnauthorizedException('Код не найден или истёк.');

    const attemptsKey = `${username}:attempts`;
    const attemptsStr = await this.redisServ.get(attemptsKey);
    const attempts = parseInt(attemptsStr ?? '0');

    // Лимит 3 ошибочных попыток
    if (attempts >= 3) {
      throw new UnauthorizedException('Превышено количество попыток.');
    }

    // Неверный код
    if (saved !== code) {
      await this.redisServ.set(attemptsKey, (attempts + 1).toString(), 60);
      throw new UnauthorizedException('Неверный код.');
    }

    // Код верный
    const user = await this.userRepo.findOne({ where: { username } });

    await this.redisServ.del(username); // удалить сам код
    await this.redisServ.del(attemptsKey); // сбросить попытки

    const tokens = await this.generateAndSaveToken(user);
    return tokens;
  }

  async logOut(userId: number) {
    try {
      return await this.tokenServ.removeToken(userId);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
