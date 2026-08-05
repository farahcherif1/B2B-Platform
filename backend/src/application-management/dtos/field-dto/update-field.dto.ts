import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldDto } from './create-field.dto';
import { IsUUID } from 'class-validator';

export class UpdateFieldDto extends PartialType(CreateFieldDto) {
  @IsUUID()
  id: string;
}
