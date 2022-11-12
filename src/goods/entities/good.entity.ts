import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Good {
  @PrimaryGeneratedColumn()
  good_idx: number;

  @Column()
  good_name: string;

  @Column()
  price: number;
}
