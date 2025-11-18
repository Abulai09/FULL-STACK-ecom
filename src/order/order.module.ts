import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItems } from './entities/orderItems.entity';
import { User } from 'src/user/user.entity';
import { Products } from 'src/products/products.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItems } from 'src/cart/entities/cartItems.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItems,
      User,
      Products,
      Cart,
      CartItems,
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
