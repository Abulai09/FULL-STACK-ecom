import { OrderItems } from './orderItems.entity';
import { User } from 'src/user/user.entity';
export declare class Order {
    id: number;
    totalPrice: number;
    status: string;
    items: OrderItems[];
    user: User;
    userId: number;
}
