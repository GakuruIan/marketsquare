import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async CreateUser(userData: CreateUserDTO) {
    try {
      const { clerkId, verified, email, username, role } = userData;

      const existingUser = await this.db.user.findUnique({
        where: {
          clerkId,
        },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const user = await this.db.user.create({
        data: {
          clerkId: clerkId,
          verified: verified,
          email: email,
          username: username,
          role: role,
        },
      });

      return user;
    } catch (error) {
      console.log(`[CREATE USER SERVICE] :${error}`);
      throw error;
    }
  }

  async UpdateUser(userData: UpdateUserDTO) {
    try {
      const { clerkId, username, email, role } = userData;

      const user = await this.db.user.findUnique({
        where: {
          clerkId,
        },
      });

      if (!user) {
        throw new NotFoundException(`No user found with id ${clerkId}`);
      }

      const updatedUser = await this.db.user.update({
        where: {
          clerkId,
        },
        data: {
          email,
          username,
          role,
        },
      });

      return updatedUser;
    } catch (error) {
      console.log(`[UPDATE USER SERVICE] :${error}`);
      throw error;
    }
  }

  async DeleteUser(clerkId: string) {
    try {
      const user = await this.db.user.findUnique({
        where: {
          clerkId,
        },
      });

      if (!user) {
        throw new NotFoundException(`No user found with id ${clerkId}`);
      }

      await this.db.user.delete({
        where: {
          clerkId,
        },
      });
    } catch (error) {
      console.log(`[DELETE USER SERVICE] :${error}`);
      throw error;
    }
  }
}
