import { User } from 'src/user/user.entity';
export declare class Token {
    id: number;
    hashedToken: string;
    expiresIn: Date;
    revoked: boolean;
    user: User;
    userId: number;
}
