import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('Coaches')
export class CoachesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;
}
