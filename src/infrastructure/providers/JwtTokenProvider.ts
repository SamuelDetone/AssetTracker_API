import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

import { AuthTokenPayload, ITokenProvider } from '../../domain/providers/ITokenProvider.js';
import { env } from '../config/env.js';

export class JwtTokenProvider implements ITokenProvider {
  createAccessToken(payload: AuthTokenPayload): string {
    return jwt.sign({ role: payload.role }, this.getAccessSecret(), {
      subject: payload.subject,
      expiresIn: '15m',
      jwtid: randomUUID(),
    });
  }

  createRefreshToken(payload: AuthTokenPayload): string {
    return jwt.sign({ role: payload.role }, this.getRefreshSecret(), {
      subject: payload.subject,
      expiresIn: '7d',
      jwtid: randomUUID(),
    });
  }

  verifyAccessToken(token: string): AuthTokenPayload {
    return this.toPayload(jwt.verify(token, this.getAccessSecret()));
  }

  verifyRefreshToken(token: string): AuthTokenPayload {
    return this.toPayload(jwt.verify(token, this.getRefreshSecret()));
  }

  getAccessTokenExpiresAt(token: string): Date {
    return this.getTokenExpiresAt(token);
  }

  getRefreshTokenExpiresAt(token: string): Date {
    return this.getTokenExpiresAt(token);
  }

  private getAccessSecret(): string {
    return env.JWT_ACCESS_SECRET;
  }

  private getRefreshSecret(): string {
    return env.JWT_REFRESH_SECRET;
  }

  private toPayload(decoded: string | object): AuthTokenPayload {
    if (typeof decoded === 'string' || !('sub' in decoded) || !('role' in decoded)) {
      throw new Error('Invalid token payload.');
    }

    if (decoded.role !== 'USER' && decoded.role !== 'ADMIN') {
      throw new Error('Invalid token role.');
    }

    return {
      subject: String(decoded.sub),
      role: decoded.role,
    };
  }

  private getTokenExpiresAt(token: string): Date {
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded === 'string' || typeof decoded.exp !== 'number') {
      throw new Error('Token without expiration date.');
    }

    return new Date(decoded.exp * 1000);
  }
}
