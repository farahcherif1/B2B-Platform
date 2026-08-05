import { Module } from '@nestjs/common';
import { FieldDependencyService } from './services/field-dependency.service';
import { FieldDependencyController } from './controllers/field-dependency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldDependency } from './entities/field-dependency.entity';
import { Field } from 'src/application-management/entities/field.entity';
import { Choice } from 'src/core-options/entities/choice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FieldDependency, Field, Choice])],
  providers: [FieldDependencyService],
  controllers: [FieldDependencyController],
})
export class FieldDependencyModule {}
