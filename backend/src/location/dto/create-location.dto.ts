import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;
  @IsInt()
  event: string;
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  meetings?: number[];
}
