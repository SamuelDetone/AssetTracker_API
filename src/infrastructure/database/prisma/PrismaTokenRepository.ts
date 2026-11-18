import { createHash } from 'node:crypto';

import {
  ITokenRepository,
  StoredRefreshToken,
} from '../../../domain/repositories/ITokenRepository.js';
import { prisma } from './client.js';

export class PrismaTokenRepository implements ITokenRepository {
  async createRefreshToken(
    investorId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.deleteExpiredTokens();

    await prisma.refreshToken.create({
      data: {
        investorId,
        tokenHash: this.hashToken(token),
        expiresAt,
      },
    });
  }

  async findRefreshToken(token: string): Promise<StoredRefreshToken | null> {
    await this.deleteExpiredTokens();

    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        tokenHash: this.hashToken(token),
      },
    });

    if (!refreshToken) {
      return null;
    }

    return {
      id: refreshToken.id,
      investorId: refreshToken.investorId,
      expiresAt: refreshToken.expiresAt,
      createdAt: refreshToken.createdAt,
    };
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        tokenHash: this.hashToken(token),
      },
    });
  }

  async deleteRefreshTokensByInvestorId(investorId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { investorId },
    });
  }

  async invalidateAccessToken(
    investorId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.deleteExpiredTokens();

    const tokenHash = this.hashToken(token);

    await prisma.invalidatedAccessToken.upsert({
      where: { tokenHash },
      create: {
        investorId,
        tokenHash,
        expiresAt,
      },
      update: { expiresAt },
    });
  }

  async isAccessTokenInvalidated(token: string): Promise<boolean> {
    await this.deleteExpiredTokens();

    const invalidatedToken = await prisma.invalidatedAccessToken.findUnique({
      where: {
        tokenHash: this.hashToken(token),
      },
      select: { id: true },
    });

    return Boolean(invalidatedToken);
  }

  private async deleteExpiredTokens(): Promise<void> {
    const now = new Date();

    await prisma.$transaction([
      prisma.refreshToken.deleteMany({
        where: {
          expiresAt: { lte: now },
        },
      }),
      prisma.invalidatedAccessToken.deleteMany({
        where: {
          expiresAt: { lte: now },
        },
      }),
    ]);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
