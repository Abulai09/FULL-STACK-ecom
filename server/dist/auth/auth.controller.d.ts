import { AuthService } from './auth.service';
import { TokenService } from 'src/token/token.service';
import { userDto } from './dto/userDto';
export declare class AuthController {
    private readonly authServ;
    private readonly tokenServ;
    constructor(authServ: AuthService, tokenServ: TokenService);
    registration(dto: userDto, res: any): Promise<{
        accessToken: string;
    }>;
    login(body: {
        phoneNumber: string;
        username: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    verifyLoginCode(body: {
        username: string;
        code: string;
    }, res: any): Promise<{
        accessToken: string;
    }>;
    logOut(req: any, res: any): Promise<{
        message: string;
    }>;
    refresh(req: any, res: any): Promise<{
        accessToken: string;
    }>;
}
