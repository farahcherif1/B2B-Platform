import { Timezone } from '../../../shared/types/timezone';
import { timeZonesNames } from '@vvo/tzdb';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateEventDto {
  id: string;

  @IsString()
  path: string;

  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  topicIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  languageIds?: string[];

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsIn(timeZonesNames, { message: 'Invalid timezone' })
  @IsOptional()
  timezone?: Timezone;
  @IsInt()
  registrations: number;
  @IsString()
  state: string;
  @IsBoolean()
  paid: boolean;
  @IsInt()
  price: number;
  @IsString()
  @IsOptional()
  type: string;
}
