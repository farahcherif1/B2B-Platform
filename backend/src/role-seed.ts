import { NestFactory } from '@nestjs/core';
import { RoleSeedModule } from './role-seed/role-seed.module';
import { RoleSeedService } from './role-seed/role-seed.service';

async function bootstrap() {
  const app = await NestFactory.create(RoleSeedModule);
  const seed = app.get(RoleSeedService);
  await seed.onApplicationBootstrap();
  await app.close();
}
bootstrap();
