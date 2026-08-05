import { IsArray, IsDate, IsOptional, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsArray()
  @IsOptional()
  @IsUUID('all', { each: true })
  intervals?: string[];

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsUUID()
  event: string;
}
