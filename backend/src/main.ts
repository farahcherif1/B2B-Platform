import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('CEPEX B2B Platform API')
    .setDescription('The CEPEX B2B Platform backend API documentation')
    .setVersion('1.0')
    .addTag('CEPEX')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
