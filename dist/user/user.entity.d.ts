import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { Token } from 'src/token/token.entity';
export declare class User {
    id: number;
    username: string;
    phoneNumber: string;
    password: string;
    sessionVersion: number;
    tokens: Token[];
    role: string;
    cart: Cart;
    orders: Order[];
}
