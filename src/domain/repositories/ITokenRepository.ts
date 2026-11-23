export type StoredRefreshToken = {
  id: string;
  investorId: string;
  expiresAt: Date;
  createdAt: Date;
};

export interface ITokenRepository {
  createRefreshToken(investorId: string, token: string, expiresAt: Date): Promise<void>;
  findRefreshToken(token: string): Promise<StoredRefreshToken | null>;
  deleteRefreshToken(token: string): Promise<void>;
  deleteRefreshTokensByInvestorId(investorId: string): Promise<void>;
  invalidateAccessToken(investorId: string, token: string, expiresAt: Date): Promise<void>;
  isAccessTokenInvalidated(token: string): Promise<boolean>;
}
