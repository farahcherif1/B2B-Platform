import { Module } from '@nestjs/common';
import { AccessService } from '../user-management/services/access.service';
import { AccessController } from '../user-management/controllers/access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from '../user-management/entities/access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Access])],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
