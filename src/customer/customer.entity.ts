import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { AddressEntity } from './address.entity';
import { IdentificationEntity } from './identification.entity';

@Entity()
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  registered_name: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ default: false, nullable: true })
  financial_alert: boolean;

  @Column({ nullable: true })
  seller_id: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @OneToOne(() => AddressEntity)
  @JoinColumn()
  address: AddressEntity;

  @OneToOne(() => IdentificationEntity)
  @JoinColumn()
  identification: IdentificationEntity;
}
