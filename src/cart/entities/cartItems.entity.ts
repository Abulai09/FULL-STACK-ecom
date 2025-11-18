import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Products } from 'src/products/products.entity';

@Entity('cartItems')
export class CartItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  priceAtPurchase: number;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Products, (products) => products.cartItems)
  products: Products;
}
