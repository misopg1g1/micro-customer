import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDto } from './customer.dto';
import { ApiQuery } from '@nestjs/swagger';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  async createCustomer(@Body() customerDto: CustomerDto) {
    return await this.customerService.createCustomer(customerDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'relations', required: false, type: Boolean || String })
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('relations') relations: any = false,
  ) {
    let transformedRelations = relations;
    if (typeof relations === 'string') {
      transformedRelations = JSON.parse(relations.toLowerCase());
    }
    return await this.customerService.findAll(skip, transformedRelations, take);
  }
}
