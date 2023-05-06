import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ZoneEnum } from './zone.enum';

@Entity()
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column('varchar')
  zone: ZoneEnum;
}
