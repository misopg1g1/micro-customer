import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './customer.entity';
import { IdentificationEntity } from './identification.entity';
import { AddressEntity } from './address.entity';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService],
      imports: [
        TypeOrmModule.forRoot({
          ...TypeOrmTestingConfig(),
          entities: [CustomerEntity, IdentificationEntity, AddressEntity],
        }),
        TypeOrmModule.forFeature([
          CustomerEntity,
          IdentificationEntity,
          AddressEntity,
        ]),
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
