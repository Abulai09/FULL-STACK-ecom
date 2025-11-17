import { CartItems } from 'src/cart/entities/cartItems.entity';
import { OrderItems } from 'src/order/entities/orderItems.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  category: string;

  @OneToMany(() => CartItems, (cartItems) => cartItems.products)
  cartItems: CartItems[];

  @OneToMany(() => OrderItems, (orderItems) => orderItems.products)
  orderItems: OrderItems[];
}
