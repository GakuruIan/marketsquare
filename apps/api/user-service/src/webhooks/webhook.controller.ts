import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node';

import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookservice: WebhookService) {}

  @Post('clerk')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() payload: any,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    try {
      if (!svixId || !svixTimestamp || !svixSignature) {
        throw new BadRequestException('Missing webhooks headers');
      }

      const webhook = new Webhook(process.env.CLERK_SIGNING_SECRET!);

      const event = webhook.verify(JSON.stringify(payload), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;

      await this.handleWebhookEvent(event);
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Handle webhook verification errors
      if (
        error.message?.includes('signature') ||
        error.message?.includes('timestamp')
      ) {
        throw new UnauthorizedException('Invalid webhook signature');
      }

      throw new BadRequestException(
        `Failed to process webhook event: ${error.message}`,
      );
    }
  }

  async handleWebhookEvent(event: WebhookEvent) {
    switch (event.type) {
      case 'user.created':
        await this.webhookservice.handleCreateUser(event.data);
        break;

      case 'user.updated':
        await this.webhookservice.handleUpdateUser(event.data);
        break;
      case 'user.deleted':
        await this.webhookservice.handleDeleteUser(event.data);
        break;
    }
  }
}
