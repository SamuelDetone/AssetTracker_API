import {
  AuthTokenPayload,
  ITokenProvider,
} from '@domain/providers/ITokenProvider.js';

export class FakeTokenProvider implements ITokenProvider {
  private accessTokenSequence = 0;
  private refreshTokenSequence = 0;
  private readonly refreshTokenPayloads = new Map<string, AuthTokenPayload>();
  public failAccessTokenExpiration = false;
  public failRefreshTokenVerification = false;

  createAccessToken(_payload: AuthTokenPayload): string {
    this.accessTokenSequence += 1;

    return `access-token-${this.accessTokenSequence}`;
  }

  createRefreshToken(payload: AuthTokenPayload): string {
    this.refreshTokenSequence += 1;

    const token = `refresh-token-${this.refreshTokenSequence}`;
    this.refreshTokenPayloads.set(token, payload);

    return token;
  }

  verifyAccessToken(_token: string): AuthTokenPayload {
    return { subject: 'investor-id', role: 'USER' };
  }

  verifyRefreshToken(token: string): AuthTokenPayload {
    if (this.failRefreshTokenVerification) {
      throw new Error('Invalid refresh token.');
    }

    const payload = this.refreshTokenPayloads.get(token);

    if (!payload) {
      throw new Error('Refresh token not found.');
    }

    return payload;
  }

  getAccessTokenExpiresAt(_token: string): Date {
    if (this.failAccessTokenExpiration) {
      throw new Error('Invalid access token.');
    }

    return new Date(Date.now() + 15 * 60 * 1000);
  }

  getRefreshTokenExpiresAt(_token: string): Date {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  registerRefreshToken(token: string, payload: AuthTokenPayload): void {
    this.refreshTokenPayloads.set(token, payload);
  }
}
