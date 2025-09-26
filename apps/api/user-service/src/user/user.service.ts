import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateUserDTO } from './dto/user.dto';

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
      console.log(error);
      throw error;
    }
  }
}
