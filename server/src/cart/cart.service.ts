import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItems } from './entities/cartItems.entity';
import { Products } from 'src/products/products.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItems) private cartItemsRepo: Repository<CartItems>,
    @InjectRepository(Products) private productRepo: Repository<Products>,
  ) {}

  async addToCart(userId: number, productId: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['cart'],
      });
      if (!user) throw new UnauthorizedException('Unauthorized');

      const product = await this.productRepo.findOne({
        where: { id: productId },
      });
      if (!product) throw new NotFoundException('Not found:<');

      let cart = user.cart;

      if (!cart) {
        cart = this.cartRepo.create({ items: [], user, userId });
        await this.cartRepo.save(cart);
      }

      let cartItems = await this.cartItemsRepo.findOne({
        where: {
          cart: { id: cart.id },
          products: { id: product.id },
        },
      });
      if (cartItems) {
        cartItems.quantity += 1;
      } else {
        cartItems = this.cartItemsRepo.create({
          name: product.name,
          priceAtPurchase: product.price,
          quantity: 1,
          cart,
          products: product,
        });
      }
      await this.cartItemsRepo.save(cartItems);

      return cartItems;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getMyCart(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.products'],
    });
    if (!cart) throw new NotFoundException('cart is empty');

    const items = cart.items.map((c) => ({
      name: c.products.name,
      priceAtPurchase: Number(c.products.price),
      quantity: c.quantity,
      total: Number(c.quantity * c.products.price),
    }));

    const totalPrice = items.reduce((sum, i) => sum + i.total, 0);
    return {
      id: cart.id,
      totalPrice: totalPrice,
      items,
    };
  }

  async removeFromMyCart(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }
    const cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.products'],
    });
    if (!cart) throw new NotFoundException('cart is empty');

    const product = await this.cartItemsRepo.findOne({
      where: {
        cart: { id: cart.id },
        products: { id: productId },
      },
      relations: ['products'],
    });
    if (!product) throw new NotFoundException('Not found:<');

    if (quantity >= product.quantity) {
      await this.cartItemsRepo.remove(product);
      return { message: ` product deleted successfully ` };
    }

    product.quantity -= quantity;
    await this.cartItemsRepo.save(product);

    return { message: ` product reduced by ${quantity} ` };
  }
}
