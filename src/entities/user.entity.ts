import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Card } from './card.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  hand: Card[] = [];

  isBot: boolean = false;

  isWaiting: boolean = false;

  @Column({default:1000})
  money: number;

  position?: number;

  bid: number = 0;
}
