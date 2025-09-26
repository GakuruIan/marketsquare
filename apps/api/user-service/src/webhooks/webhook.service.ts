import { Injectable } from '@nestjs/common';

import { UserService } from '@/user/user.service';

import { UserRole } from '@/user/dto/user.dto';

import { UserJSON } from '@clerk/clerk-sdk-node';

@Injectable()
export class WebhookService {
  constructor(private readonly userservice: UserService) {}

  async handleCreateUser(userData: UserJSON) {
    try {
      const { id, email_addresses, username, unsafe_metadata } = userData;

      const role = Object.values(UserRole).includes(
        unsafe_metadata?.role as UserRole,
      )
        ? (unsafe_metadata?.role as UserRole)
        : UserRole.CUSTOMER;

      const user = await this.userservice.CreateUser({
        clerkId: id,
        email: email_addresses[0]?.email_address,
        username: username!,
        verified: true,
        role: role,
      });

      return user;
    } catch (error) {
      console.log(`Webhook error ${error}`);
      throw error;
    }
  }
}
