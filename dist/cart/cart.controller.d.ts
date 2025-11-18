import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartServ;
    constructor(cartServ: CartService);
    addToCart(req: any, id: number): Promise<import("./entities/cartItems.entity").CartItems>;
    getMy(req: any): Promise<{
        id: number;
        totalPrice: number;
        items: {
            name: string;
            priceAtPurchase: number;
            quantity: number;
            total: number;
        }[];
    }>;
    del(req: any, id: number, q: number): Promise<{
        message: string;
    }>;
}
