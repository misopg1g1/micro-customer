import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './customer.entity';
import { QueryFailedError, Repository } from 'typeorm';
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
      identificationEntity = await this.identificationRepository.save(
        identificationEntity,
      );
      addressEntity = await this.addressRepository.save(addressEntity);
      customerEntity.identification = identificationEntity;
      customerEntity.address = addressEntity;
      return await this.customerRepository.save(customerEntity);
    } catch (e: any) {
      if (
        e.table &&
        e.message &&
        e.table === 'identification_entity' &&
        e.message.includes('duplicate')
      ) {
        throw new BusinessLogicException(
          'Ya existe un cliente con ese numero de identificación',
          BusinessError.CONFLICT,
        );
      } else
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

  async findOne(id: string, relations: boolean) {
    let customer: CustomerEntity | undefined = undefined;
    try {
      customer = await this.customerRepository.findOne({
        where: { id },
        relations: relations ? ['address', 'identification'] : [],
      });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
      }
    }
    if (!customer) {
      throw new BusinessLogicException(
        'El cliente con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return customer;
  }
}
