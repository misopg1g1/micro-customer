import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './customer.entity';
import { IdentificationEntity } from './identification.entity';
import { AddressEntity } from './address.entity';

@Module({
  providers: [CustomerService],
  controllers: [CustomerController],
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      IdentificationEntity,
      AddressEntity,
    ]),
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
