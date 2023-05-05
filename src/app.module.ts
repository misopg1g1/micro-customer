import { Module } from '@nestjs/common';
// import {TypeOrmModule} from '@nestjs/typeorm';
import { dbConfig } from './shared/config/dbconfig';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { CustomerEntity } from './customer/customer.entity';
import { IdentificationEntity } from './customer/identification.entity';
import { AddressEntity } from './customer/address.entity';

function getDBConfig() {
  return {
    ...dbConfig,
    entities: [CustomerEntity, IdentificationEntity, AddressEntity],
  };
}
@Module({
  imports: [
    TypeOrmModule.forRoot(getDBConfig()),
    HealthcheckModule,
    CustomerModule,
  ],
})
export class AppModule {}
