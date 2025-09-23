import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
