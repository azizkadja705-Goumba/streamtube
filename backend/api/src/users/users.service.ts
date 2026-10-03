import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
   const users = await this.prisma.db.orm.public.User.all();

return users.map(({ password, ...user }) => user);
  }
}
