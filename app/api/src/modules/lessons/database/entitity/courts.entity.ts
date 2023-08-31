import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CourtsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  court_name: string;
}
