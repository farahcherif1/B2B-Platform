import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateTypeParticipantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  eventId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true }) // Ensures array of UUIDs
  relatedParticipantIds?: string[];
}
