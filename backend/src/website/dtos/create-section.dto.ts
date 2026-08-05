import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imageUrls?: string[];

  @IsUUID()
  websiteTabId: string; 

  @IsOptional()
  @IsUUID()
  sectionTypeId: string;
}