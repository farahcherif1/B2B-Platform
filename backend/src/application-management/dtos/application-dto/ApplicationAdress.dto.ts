import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ApplicationAdressDto {
  @IsString()
  pays: string;

  @IsString()
  @IsOptional()
  Departement: string;

  @IsString()
  Ville: string;

  @IsNumber()
  @IsOptional()
  CodePostal: number;

  @IsString()
  @IsOptional()
  Adresse: string;
}
