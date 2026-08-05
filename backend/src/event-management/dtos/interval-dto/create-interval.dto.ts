import { IsArray, IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIntervalDto {
  @IsDate()
  @IsOptional()
  start: Date;

  @IsDate()
  @IsOptional()
  end: Date;

  @IsOptional()
  @IsString()
  @IsUUID()
  session?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  meetings?: string[];
}
