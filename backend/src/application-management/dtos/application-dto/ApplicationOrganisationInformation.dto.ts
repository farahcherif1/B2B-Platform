import { IsOptional, IsString } from 'class-validator';

export class ApplicationOrganisationInformationDto {
  @IsString()
  OrganisationName: string;

  @IsString()
  OrganisationType: string;

  @IsString()
  @IsOptional()
  OrganisationPhoneNumber: string;

  @IsString()
  OrganisationDescription: string;

  @IsString()
  @IsOptional()
  OrganisationWebsite: string;

  @IsString()
  @IsOptional()
  OrganisationLogo: string;

  @IsOptional()
  @IsString()
  OrganisationProduct: string;

  @IsString()
  @IsOptional()
  Linkedin: string;

  @IsString()
  @IsOptional()
  Facebook: string;

  @IsString()
  @IsOptional()
  X: string;

  @IsString()
  @IsOptional()
  Instagram: string;
}
