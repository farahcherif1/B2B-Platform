import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSectionTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
