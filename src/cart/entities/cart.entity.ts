import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItems } from './cartItems.entity';
import { User } from 'src/user/user.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartItems, (items) => items.cart)
  items: CartItems[];

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
