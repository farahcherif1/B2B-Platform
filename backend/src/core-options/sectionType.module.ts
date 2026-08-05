import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionType } from './entities/section-type.entity';
import { SectionTypeService } from './services/section-type.service';
import { SectionTypeController } from './controllers/section-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SectionType])],
  providers: [SectionTypeService],
  controllers: [SectionTypeController],
})
export class SectionTypeModule {}
