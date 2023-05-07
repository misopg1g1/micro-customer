import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './customer.entity';
import {
  IdentificationEntity,
  IdentificationTypeEnum,
} from './identification.entity';
import { AddressEntity } from './address.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ZoneEnum } from './zone.enum';
import { plainToInstance } from 'class-transformer';
import { CustomerDto } from './customer.dto';
import { IdentificationDto } from './identification.dto';
import { AddressDto } from './address.dto';
import { BusinessLogicException } from '../shared/errors';

describe('CustomerService', () => {
  const entities = [CustomerEntity, IdentificationEntity, AddressEntity];
  let service: CustomerService;
  let customerRepository: Repository<CustomerEntity>;
  let identificationRepository: Repository<IdentificationEntity>;
  let addressRepository: Repository<AddressEntity>;
  let customerList: CustomerEntity[];

  const createMockAddress = () => ({
    address: faker.datatype.string(),
    postal_code: faker.datatype.string(),
    city: faker.datatype.string(),
    country: faker.datatype.string(),
    zone: faker.helpers.arrayElement(Object.values(ZoneEnum)),
  });
  const createMockIdentification = () => ({
    number: faker.datatype.number(),
    type: faker.helpers.arrayElement(Object.values(IdentificationTypeEnum)),
  });
  const createMockCustomer = (): object => ({
    registered_name: faker.datatype.string(),
    first_name: faker.datatype.string(),
    last_name: faker.datatype.string(),
    financial_alert: faker.datatype.boolean(),
    seller_id: faker.datatype.string(),
    phone: faker.datatype.string(),
    email: faker.datatype.string(),
  });
  const seedDatabase = async () => {
    customerList = [];
    for (let i = 0; i < 3; i++) {
      const mockAddress = plainToInstance(AddressEntity, createMockAddress());
      const mockIdentification = plainToInstance(
        IdentificationEntity,
        createMockIdentification(),
      );
      const mockCustomer = plainToInstance(
        CustomerEntity,
        createMockCustomer(),
      );
      mockCustomer.address = mockAddress;
      mockCustomer.identification = mockIdentification;
      const address = await addressRepository.save(mockAddress);
      const identification = await identificationRepository.save(
        mockIdentification,
      );
      const customer = await customerRepository.save(mockCustomer);
      customerList.push(customer);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService],
      imports: [
        TypeOrmModule.forRoot({
          ...TypeOrmTestingConfig(),
          entities,
        }),
        TypeOrmModule.forFeature(entities),
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<Repository<CustomerEntity>>(
      getRepositoryToken(CustomerEntity),
    );
    identificationRepository = module.get<Repository<IdentificationEntity>>(
      getRepositoryToken(IdentificationEntity),
    );
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );
    await customerRepository.clear();
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a customer', async () => {
    const address = createMockAddress();
    const identification = createMockIdentification();

    const customerDto = plainToInstance(CustomerDto, {
      ...createMockCustomer(),
      address,
      identification,
    });

    const createdCustomer = await service.createCustomer(customerDto);
    expect(createdCustomer.first_name).toEqual(customerDto.first_name);
    const customers = await customerRepository.find();
    const identifications = await identificationRepository.find();
    const addresses = await addressRepository.find();
    expect(customers.length).toEqual(4);
    expect(identifications.length).toEqual(4);
    expect(addresses.length).toEqual(4);
  });

  it('should rise an exception for repeated identification number', async () => {
    const address = createMockAddress();
    const identification = createMockIdentification();

    const customerDto = plainToInstance(CustomerDto, {
      ...createMockCustomer(),
      address,
      identification,
    });

    await service.createCustomer(customerDto);
    try {
      await service.createCustomer(customerDto);
    } catch (e) {
      expect(e).toBeInstanceOf(BusinessLogicException);
    }
  });

  it('should rise an exception for repeated identification number', async () => {
    const address = createMockAddress();
    const identification = createMockIdentification();

    const customerDto = plainToInstance(CustomerDto, {
      ...createMockCustomer(),
      address,
      identification,
    });

    await service.createCustomer(customerDto);
    try {
      await service.createCustomer(customerDto);
    } catch (e) {
      expect(e).toBeInstanceOf(BusinessLogicException);
    }
  });

  it('Should return all customers list', async () => {
    const customers = await service.findAll(0, true);
    expect(customers.length).toEqual(3);
  });

  it('Should return a customer by its Id', async () => {
    const customerToSearch = customerList[0];
    const customer = await service.findOne(customerToSearch.id, true);
    expect(customer.first_name).toEqual(customerToSearch.first_name);
  });
});
