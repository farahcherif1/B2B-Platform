import { Module } from '@nestjs/common';
import { FieldController } from './controllers/field.controller';
import { FieldService } from './services/field.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { Access } from 'src/user-management/entities/access.entity';
import { Choice } from 'src/core-options/entities/choice.entity';
import { FormSection } from 'src/application-management/entities/form-section.entity';
import { JwtService } from '@nestjs/jwt';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
import { FieldDependency } from 'src/application-management/entities/field-dependency.entity';
import { FieldDependencyService } from 'src/application-management/services/field-dependency.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Field,
      Choice,
      FormSection,
      Access,
      TypeParticipant,
      FieldDependency,
    ]),
  ],
  controllers: [FieldController],
  providers: [FieldService, JwtService, FieldDependencyService],
})
export class FieldModule {}
