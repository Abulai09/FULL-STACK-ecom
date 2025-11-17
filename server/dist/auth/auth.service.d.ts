import { Token } from 'src/token/token.entity';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { userDto } from './dto/userDto';
import { SmsService } from 'src/sms/sms.service';
import { RedisService } from 'src/redis/redis.service';
export declare class AuthService {
    private readonly tokenServ;
    private userRepo;
    private tokenRepo;
    private readonly smsServ;
    private readonly redisServ;
    constructor(tokenServ: TokenService, userRepo: Repository<User>, tokenRepo: Repository<Token>, smsServ: SmsService, redisServ: RedisService);
    generateAndSaveToken(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    registration(dto: userDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(phoneNumber: string, username: string, password: string): Promise<{
        message: string;
    }>;
    verifyLoginCode(username: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logOut(userId: number): Promise<{
        message: string;
    }>;
}
