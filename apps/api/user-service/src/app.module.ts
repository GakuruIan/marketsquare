import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhooks/webhook.module';

@Module({
  imports: [PrismaModule, HealthModule, UserModule, WebhookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
