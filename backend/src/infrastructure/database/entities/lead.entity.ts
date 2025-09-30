import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BrokerOfficeEntity } from './broker-office.entity';

@Entity('leads')
export class LeadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ name: 'phone_number', length: 20 })
  phoneNumber: string;

  @Column({ name: 'email_address', length: 255 })
  emailAddress: string;

  @Column({ length: 50 })
  city: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'assigned', 'contacted', 'closed'],
    default: 'pending'
  })
  status: string;

  @Column({ name: 'assigned_broker_id', type: 'uuid', nullable: true })
  assignedBrokerId?: string;

  @ManyToOne(() => BrokerOfficeEntity)
  @JoinColumn({ name: 'assigned_broker_id' })
  assignedBroker?: BrokerOfficeEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

