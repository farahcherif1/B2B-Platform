import { Module, OnModuleInit } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { MailerController } from './mailer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerHistory } from './entities/mailerHistory.entity';
import { JwtService } from '@nestjs/jwt';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
import { TypeParticipantModule } from 'src/application-management/type-participant.module';
import { ApplicationModule } from 'src/application-management/application.module';
import { Application } from 'src/application-management/entities/application.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([MailerHistory,TypeParticipant,Application]),
    TypeParticipantModule,
    ApplicationModule,
  ],
  controllers: [MailerController],
  providers: [MailerService, JwtService],
  exports: [MailerService,TypeOrmModule],
})
export class MailerModule implements OnModuleInit {
  onModuleInit() { }
}