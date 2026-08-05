import { Module } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { UserModule } from 'src/user-management/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configureService: ConfigService) => ({
        secret: configureService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
  controllers: [],
})
export class TokenModule {}
