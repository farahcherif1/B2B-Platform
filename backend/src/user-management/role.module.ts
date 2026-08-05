import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { AccessModule } from './access.module';
import { UserRole } from 'src/user-management/entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole]), AccessModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
