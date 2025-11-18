import { Cart } from 'src/cart/entities/cart.entity';
import { CartItems } from 'src/cart/entities/cartItems.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItems } from './entities/orderItems.entity';
export declare class OrderService {
    private userRepo;
    private cartRepo;
    private cartItemsRepo;
    private orderRepo;
    private orderItemsRepo;
    constructor(userRepo: Repository<User>, cartRepo: Repository<Cart>, cartItemsRepo: Repository<CartItems>, orderRepo: Repository<Order>, orderItemsRepo: Repository<OrderItems>);
    addOrder(userId: number): Promise<{
        message: string;
        orderId: number;
        totalPrice: number;
        status: string;
        items: {
            name: string;
            quantity: number;
            price: number;
        }[];
    }>;
    getMyOrders(userId: number): Promise<{
        id: number;
        totalPrice: number;
        status: string;
        items: {
            name: string;
            price: number;
            quantity: number;
        }[];
    }[]>;
    cancellOrder(orderId: number, userId: number): Promise<{
        message: string;
    }>;
}
