import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ApplicationPersonalInformationDto {
  @IsUUID()
  ParticipationType: string;

  @IsString()
  FirstName: string;

  @IsString()
  LastName: string;

  @IsString()
  @IsOptional()
  Function: string;

  @IsString()
  @IsOptional()
  PhoneNumber: string;


  @IsOptional()
  @IsString()
  ProfilePicture: string;
}
