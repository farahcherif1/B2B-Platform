import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/user-management/entities/role.entity';
import { RoleModule } from 'src/user-management/role.module';
import { UserRoleModule } from 'src/user-management/user-role.module';
import { EventModule } from 'src/event-management/event.module';
import { Token } from 'src/auth/entities/token.entity';
import { Application } from 'src/application-management/entities/application.entity';
import { UserRole } from 'src/user-management/entities/user-role.entity';
import { MailerModule } from 'src/shared/mailer/mailer.module';
import { Meeting } from 'src/event-management/entities/meeting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Token,
      Application,
      UserRole,
      Meeting,
    ]),
    RoleModule,
    UserRoleModule,
    EventModule,
    MailerModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
