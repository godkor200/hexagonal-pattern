import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CustomersEntity as Customer } from './customers.entity';
import { CoachesEntity as Coach } from './coaches.entity';
import { CourtsEntity as Court } from './courts.entity';

/**
 * id: 레슨 예약의 고유 ID
 * customer_id: 이 레슨을 예약한 고객의 ID (Customers 테이블 참조)
 * coach_id: 이 레슨을 진행할 코치의 ID (Coaches 테이블 참조)
 * court_id : 이 러슨에서 사용할 코트ID (Courts 테이블 참조)
 * start_time : 러슨 시작 시간
 * end_time : 러슨 종료 시간
 * lesson_type : 1회, 주 1회, 주 2회, 주 3회 등등
 */

@Entity('Lessons')
export class LessonEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ type: 'int', name: 'customer_id' })
  customerId: number;

  @Column({ type: 'int', name: 'coach_id' })
  coachId: number;

  @Column({ type: 'int', name: 'court_id' })
  courtId: number;

  @Column({ type: 'datetime', name: 'start_time' })
  startTime: Date;

  @Column({
    type: 'enum',
    enum: ['30min', '1hour'],
    default: '30min',
    name: 'end_time',
  })
  endTime: string;

  @Column({
    type: 'enum',
    enum: ['trial', 'once_a_week', 'twice_a_week', 'three_times_a_week'],
    default: 'trial',
    name: 'lesson_type',
  })
  lessonType: string;

  // @ManyToOne(() => Customer,(Customer)=>Customer.id)
  // customer: Customer;
  //
  // @ManyToOne(() => Coach,(Coach)=>Coach.id)
  // coach: Coach;
  //
  // @ManyToOne(() => Court,(Court)=>Court.id)
  // court: Court;
}
