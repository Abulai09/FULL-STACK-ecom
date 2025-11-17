import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItems } from 'src/cart/entities/cartItems.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItems } from './entities/orderItems.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItems) private cartItemsRepo: Repository<CartItems>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItems)
    private orderItemsRepo: Repository<OrderItems>,
  ) {}

  async addOrder(userId: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new UnauthorizedException('Unauthorized');

      const cart = await this.cartRepo.findOne({
        where: { userId },
        relations: ['items', 'items.products'],
      });
      if (!cart) throw new NotFoundException('Not found');

      const items = cart.items.map((c) => ({
        name: c.name,
        quantity: c.quantity,
        priceAtPurchase: c.priceAtPurchase,
        total: Number(c.quantity) * c.priceAtPurchase,
        products: c.products,
      }));

      const totalPrice = items.reduce((sum, i) => sum + i.total, 0);
      const order = this.orderRepo.create({
        totalPrice: totalPrice,
        status: 'pending',
        user,
        userId,
        items: [],
      });
      await this.orderRepo.save(order);

      const OrderItems = this.orderItemsRepo.create(
        items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          priceAtPurchase: i.priceAtPurchase,
          order,
          products: i.products,
        })),
      );
      await this.orderItemsRepo.save(OrderItems);

      await this.cartItemsRepo.delete({ cart: { id: cart.id } });
      return {
        message: 'Order created successfully',
        orderId: order.id,
        totalPrice: order.totalPrice,
        status: order.status,
        items: OrderItems.map((o) => ({
          name: o.name,
          quantity: o.quantity,
          price: o.priceAtPurchase,
        })),
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getMyOrders(userId: number) {
    const orders = await this.orderRepo.find({
      where: { userId },
      relations: ['items'],
      order: { id: 'DESC' },
    });
    if (!orders.length) throw new NotFoundException('not found:(');
    return orders.map((order) => ({
      id: order.id,
      totalPrice: order.totalPrice,
      status: order.status,
      items: order.items.map((o) => ({
        name: o.name,
        price: o.priceAtPurchase,
        quantity: o.quantity,
      })),
    }));
  }

  async cancellOrder(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: {
        id: orderId,
        user: { id: userId },
      },
    });
    if (!order) throw new NotFoundException('not found:(');

    if (order.status !== 'pending') {
      throw new BadRequestException(
        `Order cannot be cancelled. Current status: ${order.status}`,
      );
    }

    order.status = 'cancelled';
    await this.orderRepo.save(order);
    return { message: 'Your order was cancelled' };
  }
}
