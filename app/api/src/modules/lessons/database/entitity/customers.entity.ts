import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomersEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 500 })
  username: string;

  @Column({ length: 500 })
  password_hashed: string;
}
