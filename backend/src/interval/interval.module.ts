import { Module } from '@nestjs/common';
import { IntervalService } from './interval.service';
import { IntervalController } from './interval.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interval } from './entities/interval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interval])],
  controllers: [IntervalController],
  providers: [IntervalService],
})
export class IntervalModule {}
