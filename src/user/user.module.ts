import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Token } from 'src/token/token.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Order])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
