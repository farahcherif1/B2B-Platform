import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user-management//controllers/user.controller';
import { UserModule } from './user-management/user.module';
import { RoleModule } from './user-management/role.module';
import { AccessModule } from './user-management/access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from './event-management/event.module';
import { LanguageModule } from './core-options/language.module';
import { UserRoleModule } from './user-management/user-role.module';
import { TokenModule } from './auth/token.module';
import { MailerModule } from './shared/mailer/mailer.module';
import { TopicModule } from './core-options/topic.module';
import { CountryModule } from './core-options/country.module';
import { RoleSeedModule } from './role-seed/role-seed.module';
import { FieldModule } from './application-management/field.module';
import { ChoiceModule } from './core-options/choice.module';
import { FormSectionModule } from './application-management/form-section.module';
import { ApplicationModule } from './application-management/application.module';
import { TypeParticipantModule } from './application-management/type-participant.module';
import { S3Module } from './shared/s3/s3.module';
import { FieldDependencyModule } from './application-management/field-dependency.module';
import { MeetingModule } from './event-management/meeting.module';
import { LocationModule } from './event-management/location.module';
import { SessionModule } from './event-management/session.module';
import { IntervalModule } from './event-management/interval.module';
import { ConfigModule } from '@nestjs/config';
import { WebsiteModule } from './website/website.module';
import { SectionTypeModule } from './core-options/sectionType.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot({
      ...require('./config/typeorm').dbConfig,
      autoLoadEntities: true, 
      migrations: [], 
    }),
    UserModule,
    RoleModule,
    AccessModule,
    EventModule,
    LanguageModule,
    UserRoleModule,
    TopicModule,
    CountryModule,
    RoleSeedModule,
    TokenModule,
    MailerModule,
    FieldModule,
    ChoiceModule,
    FormSectionModule,
    ApplicationModule,
    TypeParticipantModule,
    S3Module,
    FieldDependencyModule,
    MeetingModule,
    LocationModule,
    SessionModule,
    IntervalModule,
    WebsiteModule,
    SectionTypeModule
  ],
  controllers: [AppController, UserController,],
  providers: [AppService],
})
export class AppModule {}
