import { IsString } from 'class-validator';

export class CreateAccessDto {
  @IsString()
  name: string;
}
