import { Module } from '@nestjs/common';
import { ChoiceService } from './services/choice.service';
import { ChoiceController } from './controllers/choice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Choice } from './entities/choice.entity';
import { JwtService } from '@nestjs/jwt';
import { FieldDependency } from 'src/application-management/entities/field-dependency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Choice, FieldDependency])],
  providers: [ChoiceService, JwtService],
  controllers: [ChoiceController],
})
export class ChoiceModule {}
