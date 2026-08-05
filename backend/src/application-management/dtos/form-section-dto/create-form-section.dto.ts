import { IsArray, IsInt, IsString } from 'class-validator';

export class CreateFormSectionDto {
  @IsString()
  name: string;

  @IsString()
  eventId: string;

  @IsArray()
  @IsString({ each: true })
  fieldIds: string[];
}
