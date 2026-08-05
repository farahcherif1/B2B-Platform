import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldDependencyDto } from './create-field-dependency.dto';

export class UpdateFieldDependencyDto extends PartialType(
  CreateFieldDependencyDto,
) {}
