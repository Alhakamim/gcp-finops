import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create tenant + user in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName || `${dto.email.split('@')[0]}'s Organization`,
          slug: dto.tenantSlug || dto.email.split('@')[0],
          plan: 'starter',
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
          role: 'admin',
          tenantId: tenant.id,
        },
      });

      return { tenant, user };
    });

    const token = this.generateToken(result.user);

    this.logger.log(`New user registered: ${dto.email}`);
    return { token, user: { id: result.user.id, email: result.user.email, name: result.user.name, role: result.user.role, tenant: result.tenant } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { tenant: true },
    });

    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');
    if (!(await bcrypt.compare(dto.password, user.password))) throw new UnauthorizedException('Invalid credentials');
    if (user.tenant.status !== 'active') throw new UnauthorizedException('Account suspended');

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: 'login',
        resource: 'user',
        resourceId: user.id,
        details: { email: user.email },
      },
    });

    const token = this.generateToken(user);
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role, tenant: user.tenant } };
  }

  private generateToken(user: { id: string; email: string; tenantId: string; role: string }) {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    });
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, image: true, tenantId: true, createdAt: true, lastLogin: true, tenant: { select: { name: true, slug: true, plan: true } } },
    });
  }
}
