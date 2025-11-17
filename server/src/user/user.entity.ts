import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { Token } from 'src/token/token.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  sessionVersion: number;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @Column({ default: 'user' })
  role: string;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
