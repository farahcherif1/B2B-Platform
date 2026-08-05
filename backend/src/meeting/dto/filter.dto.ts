import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Status } from 'src/shared/enum/Status.enum';
export class FilterDto {
  @IsOptional()
  @IsString()
  searchQuery?: string = null;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit?: number;

  @IsOptional()
  @IsNumber()
  sessionId?: number = null;

  @IsOptional()
  @IsNumber()
  locationId?: number = null;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date = null;

  @IsNumber()
  eventId: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status = null;

  @IsOptional()
  @IsNumber()
  intervalId?: number = null;
}
