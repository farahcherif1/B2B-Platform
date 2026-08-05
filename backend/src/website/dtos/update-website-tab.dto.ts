import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateWebsiteTabDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  eventId?: string; // The ID of the event this tab belongs to
}
