import { IsArray, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateIntervalDto {
  @IsDate()
  @IsOptional()
  start: Date;
  @IsDate()
  @IsOptional()
  end: Date;
  @IsOptional()
  @IsNumber()
  session?: number;
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  meetings?: number[];
}
