import { CartItems } from 'src/cart/entities/cartItems.entity';
import { OrderItems } from 'src/order/entities/orderItems.entity';
export declare class Products {
    id: number;
    name: string;
    price: number;
    category: string;
    cartItems: CartItems[];
    orderItems: OrderItems[];
}
