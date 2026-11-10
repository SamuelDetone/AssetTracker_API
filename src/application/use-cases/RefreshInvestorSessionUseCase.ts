import { AuthenticationResult } from './AuthenticateInvestorUseCase.js';
import { AppError } from '../../domain/errors/AppError.js';
import { ITokenProvider } from '../../domain/providers/ITokenProvider.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';

export class RefreshInvestorSessionUseCase {
  constructor(
    private readonly investorRepository: IInvestorRepository,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(refreshToken: string): Promise<AuthenticationResult> {
    let payload;

    try {
      payload = this.tokenProvider.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Refresh token invalido ou expirado.', 401);
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

    return {
      investor: {
        id: investor.id,
        name: investor.name,
        email: investor.email,
        role: investor.role,
      },
      accessToken: this.tokenProvider.createAccessToken(tokenPayload),
      refreshToken: this.tokenProvider.createRefreshToken(tokenPayload),
    };
  }
}
