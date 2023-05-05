import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './customer.entity';
import { Repository } from 'typeorm';
import { CustomerDto } from './customer.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessError, BusinessLogicException } from '../shared/errors';
import { AddressEntity } from './address.entity';
import { IdentificationEntity } from './identification.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @InjectRepository(IdentificationEntity)
    private identificationRepository: Repository<IdentificationEntity>,
  ) {}

  async createCustomer(customerDto: CustomerDto) {
    let addressEntity = plainToInstance(AddressEntity, customerDto.address);
    let identificationEntity = plainToInstance(
      IdentificationEntity,
      customerDto.identification,
    );
    const customerEntity = plainToInstance(CustomerEntity, customerDto);
    try {
      addressEntity = await this.addressRepository.save(addressEntity);
      identificationEntity = await this.identificationRepository.save(
        identificationEntity,
      );
      customerEntity.address = addressEntity;
      customerEntity.identification = identificationEntity;
      const customer = await this.customerRepository.save(customerEntity);
      return customer;
    } catch (e: any) {
      throw new BusinessLogicException(
        e.message ? e.message : 'Ocurrio un error al crear un cliente',
        BusinessError.BAD_REQUEST,
      );
    }
  }

  async findAll(skip = 0, relations: boolean, take?: number) {
    let options: object = {
      skip,
      relations: relations ? ['address', 'identification'] : [],
    };
    if (take) {
      options = { ...options, take: take };
    }
    return await this.customerRepository.find(options);
  }
}
