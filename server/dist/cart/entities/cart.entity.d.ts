import { CartItems } from './cartItems.entity';
import { User } from 'src/user/user.entity';
export declare class Cart {
    id: number;
    items: CartItems[];
    user: User;
    userId: number;
}
