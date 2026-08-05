import { IsArray, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  intervals?: number[];
  @IsDate()
  startTime: Date;
  @IsDate()
  endTime: Date;
  @IsNumber()
  event: number;
}
