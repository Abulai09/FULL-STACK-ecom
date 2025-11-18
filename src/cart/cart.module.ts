import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Cart } from './entities/cart.entity';
import { CartItems } from './entities/cartItems.entity';
import { Products } from 'src/products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItems, Products])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
