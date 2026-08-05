import { IsArray, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imageUrls?: string[];


  @IsOptional()
  @IsUUID()
  websiteTabId?: string;

  @IsOptional()
  @IsUUID()
  sectionTypeId?: string;
}
