import { IsEnum, IsInt } from 'class-validator';
import { Status } from 'src/shared/enum/Status.enum';

export class CreateMeetingDto {
  @IsInt()
  hostId: string;
  @IsInt()
  guestId: string;
  @IsInt()
  intervalId: string;
  @IsInt()
  locationId: string;
  @IsInt()
  eventId: string;
  @IsEnum(Status)
  status: Status;
  @IsInt()
  sessionId: string;
}
