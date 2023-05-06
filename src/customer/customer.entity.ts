import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  BeforeInsert,
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

  @Column()
  financial_alert: boolean;

  @Column()
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

  @BeforeInsert()
  generateSKU() {
    this.financial_alert = this.financial_alert || false;
  }
}
