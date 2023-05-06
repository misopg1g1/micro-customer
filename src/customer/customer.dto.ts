import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { IdentificationDto } from './identification.dto';

export class CustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  registered_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  financial_alert: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  seller_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  readonly address: AddressDto;

  @ValidateNested()
  @Type(() => IdentificationDto)
  readonly identification: IdentificationDto;

  constructor(partial: Partial<CustomerDto>) {
    Object.assign(this, partial);
    this.financial_alert = this.financial_alert ?? true;
  }
}
