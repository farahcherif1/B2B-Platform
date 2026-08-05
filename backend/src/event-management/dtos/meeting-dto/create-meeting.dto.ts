import { IsEnum, IsUUID } from 'class-validator';
import { Status } from 'src/shared/enum/Status.enum';

export class CreateMeetingDto {
  @IsUUID()
  hostId: string;

  @IsUUID()
  guestId: string;

  @IsUUID()
  intervalId: string;

  @IsUUID()
  locationId: string;

  @IsUUID()
  eventId: string;

  @IsEnum(Status)
  status: Status;

  @IsUUID()
  sessionId: string;
}
