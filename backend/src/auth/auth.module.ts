import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './core/strategies/jwt.strategy';
import { UserModule } from 'src/user-management/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from 'src/user-management/role.module';
import { TokenModule } from 'src/auth/token.module';
import { MailerModule } from 'src/shared/mailer/mailer.module';
import { UserRoleModule } from 'src/user-management/user-role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user-management/entities/user.entity';
import { Role } from 'src/user-management/entities/role.entity';
import { Token } from 'src/auth/entities/token.entity';
import { UserRole } from 'src/user-management/entities/user-role.entity';
import { Application } from 'src/application-management/entities/application.entity';
import { EventModule } from 'src/event-management/event.module';

@Module({
  imports: [
    PassportModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, Token, Application, UserRole]),
    UserModule,
    TokenModule,
    MailerModule,
    ConfigModule,
    UserRoleModule,
    EventModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
