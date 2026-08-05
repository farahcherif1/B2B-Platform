import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsUUID()
  event: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  meetings?: string[];
}
