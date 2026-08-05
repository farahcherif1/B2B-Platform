import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { FieldType } from 'src/shared/enum/FieldType';

export class CreateFieldDto {
  @IsString()
  title: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsBoolean()
  required: boolean;

  @IsString()
  description: string;

  @IsArray()
  @IsUUID('all', { each: true })
  participantsTypeId: string[];

  @IsOptional()
  @IsUUID()
  relatedFieldId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  choiceIds?: string[];

  @IsOptional()
  dependencies?: Array<{
    choiceId: string; // The choice that triggers the dependency
    dependentQuestionId: string; // The question that depends on the choice
  }>;
}
