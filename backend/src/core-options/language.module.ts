import { Module } from "@nestjs/common";
import { LanguageController } from "./controllers/language.controller";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { LanguageService } from "./services/language.service";
@Module({
    imports: [
        TypeOrmModule.forFeature([Language]),
    ],
    controllers: [LanguageController],
    providers: [LanguageService],
    })
export class LanguageModule {}