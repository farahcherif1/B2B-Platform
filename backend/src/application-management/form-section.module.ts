import { Module } from '@nestjs/common';
import { FormSectionService } from './services/form-section.service';
import { FormSectionController } from './controllers/form-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormSection } from './entities/form-section.entity';
import { Event } from 'src/event-management/entities/event.entity';
import { Field } from 'src/application-management/entities/field.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([FormSection, Event, Field])],
  providers: [FormSectionService, JwtService],
  controllers: [FormSectionController],
})
export class FormSectionModule {}
