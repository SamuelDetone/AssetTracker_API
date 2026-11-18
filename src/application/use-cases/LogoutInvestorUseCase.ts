import { AppError } from '../../domain/errors/AppError.js';
import { ITokenProvider } from '../../domain/providers/ITokenProvider.js';
import { ITokenRepository } from '../../domain/repositories/ITokenRepository.js';

export class LogoutInvestorUseCase {
  constructor(
    private readonly tokenProvider: ITokenProvider,
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(investorId: string, accessToken: string): Promise<void> {
    let expiresAt: Date;

    try {
      expiresAt = this.tokenProvider.getAccessTokenExpiresAt(accessToken);
    } catch {
      throw new AppError('Token JWT invalido ou expirado.', 401);
    }

    await this.tokenRepository.invalidateAccessToken(
      investorId,
      accessToken,
      expiresAt,
    );
    await this.tokenRepository.deleteRefreshTokensByInvestorId(investorId);
  }
}
