import { AuthenticationResult } from './AuthenticateInvestorUseCase.js';
import { AppError } from '../../domain/errors/AppError.js';
import { ITokenProvider } from '../../domain/providers/ITokenProvider.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';
import { ITokenRepository } from '../../domain/repositories/ITokenRepository.js';

export class RefreshInvestorSessionUseCase {
  constructor(
    private readonly investorRepository: IInvestorRepository,
    private readonly tokenProvider: ITokenProvider,
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<AuthenticationResult> {
    let payload;

    try {
      payload = this.tokenProvider.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Refresh token invalido ou expirado.', 401);
    }

    const storedRefreshToken =
      await this.tokenRepository.findRefreshToken(refreshToken);

    if (
      !storedRefreshToken ||
      storedRefreshToken.investorId !== payload.subject
    ) {
      throw new AppError('Refresh token invalido ou ja utilizado.', 401);
    }

    const investor = await this.investorRepository.findById(payload.subject);

    if (!investor) {
      throw new AppError(
        'Conta associada ao refresh token nao encontrada.',
        401,
      );
    }

    const tokenPayload = {
      subject: investor.id,
      role: investor.role,
    };

    const accessToken = this.tokenProvider.createAccessToken(tokenPayload);
    const nextRefreshToken =
      this.tokenProvider.createRefreshToken(tokenPayload);

    await this.tokenRepository.deleteRefreshToken(refreshToken);
    await this.tokenRepository.createRefreshToken(
      investor.id,
      nextRefreshToken,
      this.tokenProvider.getRefreshTokenExpiresAt(nextRefreshToken),
    );

    return {
      investor: {
        id: investor.id,
        name: investor.name,
        email: investor.email,
        role: investor.role,
      },
      accessToken,
      refreshToken: nextRefreshToken,
    };
  }
}
