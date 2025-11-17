import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItems } from './entities/cartItems.entity';
import { Products } from 'src/products/products.entity';
export declare class CartService {
    private userRepo;
    private cartRepo;
    private cartItemsRepo;
    private productRepo;
    constructor(userRepo: Repository<User>, cartRepo: Repository<Cart>, cartItemsRepo: Repository<CartItems>, productRepo: Repository<Products>);
    addToCart(userId: number, productId: number): Promise<CartItems>;
    getMyCart(userId: number): Promise<{
        id: number;
        totalPrice: number;
        items: {
            name: string;
            priceAtPurchase: number;
            quantity: number;
            total: number;
        }[];
    }>;
    removeFromMyCart(userId: number, productId: number, quantity: number): Promise<{
        message: string;
    }>;
}
