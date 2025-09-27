import { Injectable } from '@nestjs/common';

import { UserService } from '@/user/user.service';

import { UserRole } from '@/user/dto/user.dto';

import { UserJSON, DeletedObjectJSON } from '@clerk/clerk-sdk-node';

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

  async handleUpdateUser(userData: UserJSON) {
    try {
      const { id, unsafe_metadata, username, email_addresses } = userData;

      const role = Object.values(UserRole).includes(
        unsafe_metadata?.role as UserRole,
      )
        ? (unsafe_metadata?.role as UserRole)
        : UserRole.CUSTOMER;

      const user = await this.userservice.UpdateUser({
        clerkId: id,
        role,
        username: username!,
        email: email_addresses[0]?.email_address,
      });

      return user;
    } catch (error) {
      console.log(`[UPDATE USER WEBHOOK] ${error}`);
      throw error;
    }
  }

  async handleDeleteUser(deletedData: DeletedObjectJSON) {
    try {
      if (!deletedData.id) {
        throw new Error('Invalid user deletion event: missing ID');
      }

      await this.userservice.DeleteUser(deletedData.id);
    } catch (error) {
      console.log(`[DELETE USER WEBHOOK] ${error}`);
      throw error;
    }
  }
}
