import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWebsiteTabDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  eventId?: string; // The ID of the event this tab belongs to
}
