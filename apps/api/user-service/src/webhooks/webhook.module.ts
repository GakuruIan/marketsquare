import { Module } from '@nestjs/common';

import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';

import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
