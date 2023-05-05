import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentificationEntity } from '../../customer/identification.entity';
import { AddressEntity } from '../../customer/address.entity';
import { CustomerEntity } from '../../customer/customer.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: [CustomerEntity, IdentificationEntity, AddressEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CustomerEntity,
    IdentificationEntity,
    AddressEntity,
  ]),
];
