import { Cart } from './cart.entity';
import { Products } from 'src/products/products.entity';
export declare class CartItems {
    id: number;
    name: string;
    priceAtPurchase: number;
    quantity: number;
    cart: Cart;
    products: Products;
}
