import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { LessonEntity } from './lesson.entity';

@Entity('Customers')
export class CustomersEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ length: 500 })
  username: string;

  @Column({ length: 500 })
  password: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'phone_number', length: 20 })
  phoneNumber: string;

  @OneToMany(() => LessonEntity, (lesson) => lesson.customer)
  lessons: LessonEntity[];
}
