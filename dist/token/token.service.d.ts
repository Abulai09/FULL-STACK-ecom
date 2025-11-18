import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { JwtService } from '@nestjs/jwt';
export declare class TokenService {
    private userRepo;
    private tokenRepo;
    private readonly jwtServ;
    constructor(userRepo: Repository<User>, tokenRepo: Repository<Token>, jwtServ: JwtService);
    generateWebTokens(payload: any): {
        accessToken: string;
        refreshToken: string;
    };
    saveToken(refreshToken: string, userId: number): Promise<Token>;
    removeToken(userId: number): Promise<{
        message: string;
    }>;
    refreshToken(oldToken: string): Promise<{
        newTokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
}
