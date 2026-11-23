import { randomUUID } from 'node:crypto';

import { ITokenRepository, StoredRefreshToken } from '@domain/repositories/ITokenRepository.js';

type InvalidatedAccessToken = {
  investorId: string;
  expiresAt: Date;
};

export class InMemoryTokenRepository implements ITokenRepository {
  private readonly refreshTokens = new Map<string, StoredRefreshToken>();
  private readonly invalidatedAccessTokens = new Map<string, InvalidatedAccessToken>();

  async createRefreshToken(investorId: string, token: string, expiresAt: Date): Promise<void> {
    this.deleteExpiredTokens();

    this.refreshTokens.set(token, {
      id: randomUUID(),
      investorId,
      expiresAt,
      createdAt: new Date(),
    });
  }

  async findRefreshToken(token: string): Promise<StoredRefreshToken | null> {
    this.deleteExpiredTokens();

    return this.refreshTokens.get(token) ?? null;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    this.refreshTokens.delete(token);
  }

  async deleteRefreshTokensByInvestorId(investorId: string): Promise<void> {
    for (const [token, refreshToken] of this.refreshTokens) {
      if (refreshToken.investorId === investorId) {
        this.refreshTokens.delete(token);
      }
    }
  }

  async invalidateAccessToken(investorId: string, token: string, expiresAt: Date): Promise<void> {
    this.deleteExpiredTokens();

    this.invalidatedAccessTokens.set(token, {
      investorId,
      expiresAt,
    });
  }

  async isAccessTokenInvalidated(token: string): Promise<boolean> {
    this.deleteExpiredTokens();

    return this.invalidatedAccessTokens.has(token);
  }

  private deleteExpiredTokens(): void {
    const now = new Date();

    for (const [token, refreshToken] of this.refreshTokens) {
      if (refreshToken.expiresAt <= now) {
        this.refreshTokens.delete(token);
      }
    }

    for (const [token, invalidatedToken] of this.invalidatedAccessTokens) {
      if (invalidatedToken.expiresAt <= now) {
        this.invalidatedAccessTokens.delete(token);
      }
    }
  }
}
