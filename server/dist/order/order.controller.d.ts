import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderServ;
    constructor(orderServ: OrderService);
    addOrder(req: any): Promise<{
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
    myOrders(req: any): Promise<{
        id: number;
        totalPrice: number;
        status: string;
        items: {
            name: string;
            price: number;
            quantity: number;
        }[];
    }[]>;
    cancellOrder(req: any, id: number): Promise<{
        message: string;
    }>;
}
