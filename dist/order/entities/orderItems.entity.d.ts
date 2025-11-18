import { Order } from './order.entity';
import { Products } from 'src/products/products.entity';
export declare class OrderItems {
    id: number;
    name: string;
    quantity: number;
    priceAtPurchase: number;
    order: Order;
    products: Products;
}
