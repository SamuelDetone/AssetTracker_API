import jwt from 'jsonwebtoken';

import {
  AuthTokenPayload,
  ITokenProvider,
} from '../../domain/providers/ITokenProvider.js';

export class JwtTokenProvider implements ITokenProvider {
  createAccessToken(payload: AuthTokenPayload): string {
    return jwt.sign({ role: payload.role }, this.getAccessSecret(), {
      subject: payload.subject,
      expiresIn: '15m',
    });
  }

  createRefreshToken(payload: AuthTokenPayload): string {
    return jwt.sign({ role: payload.role }, this.getRefreshSecret(), {
      subject: payload.subject,
      expiresIn: '7d',
    });
  }

  verifyAccessToken(token: string): AuthTokenPayload {
    return this.toPayload(jwt.verify(token, this.getAccessSecret()));
  }

  verifyRefreshToken(token: string): AuthTokenPayload {
    return this.toPayload(jwt.verify(token, this.getRefreshSecret()));
  }

  private getAccessSecret(): string {
    return process.env.JWT_ACCESS_SECRET ?? 'assettracker-access-secret';
  }

  private getRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET ?? 'assettracker-refresh-secret';
  }

  private toPayload(decoded: string | object): AuthTokenPayload {
    if (
      typeof decoded === 'string' ||
      !('sub' in decoded) ||
      !('role' in decoded)
    ) {
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
}
