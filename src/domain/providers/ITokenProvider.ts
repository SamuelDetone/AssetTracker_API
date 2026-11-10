import { InvestorRole } from '../entities/Investor.js';

export type AuthTokenPayload = {
  subject: string;
  role: InvestorRole;
};

export interface ITokenProvider {
  createAccessToken(payload: AuthTokenPayload): string;
  createRefreshToken(payload: AuthTokenPayload): string;
  verifyAccessToken(token: string): AuthTokenPayload;
  verifyRefreshToken(token: string): AuthTokenPayload;
}
