import { ConflictException, Injectable } from '@nestjs/common';
import argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const existingEmail = await this.prisma.db.orm.public.User.first({
      email: dto.email,
    });

    if (existingEmail) {
      throw new ConflictException('Cet e-mail est déjà utilisé.');
    }

    const existingUsername = await this.prisma.db.orm.public.User.first({
      username: dto.username,
    });

    if (existingUsername) {
      throw new ConflictException("Ce nom d'utilisateur est déjà utilisé.");
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.db.orm.public.User.create({
      id: crypto.randomUUID(),
      email: dto.email,
      username: dto.username,
      password: passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}