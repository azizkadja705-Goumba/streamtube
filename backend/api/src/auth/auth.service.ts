import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(dto: LoginDto) {
    const user = await this.prisma.db.orm.public.User.first({
      email: dto.email,
    });

    if (!user) {
      throw new ConflictException('E-mail ou mot de passe incorrect.');
    }

    const passwordValid = await argon2.verify(user.password, dto.password);

    if (!passwordValid) {
      throw new ConflictException('E-mail ou mot de passe incorrect.');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}