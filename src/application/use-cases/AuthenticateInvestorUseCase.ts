import { Investor, InvestorProfile } from '../../domain/entities/Investor.js';
import { AppError } from '../../domain/errors/AppError.js';
import { IHashProvider } from '../../domain/providers/IHashProvider.js';
import { ITokenProvider } from '../../domain/providers/ITokenProvider.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';

type AuthenticateInvestorInput = {
  email: string;
  password: string;
};

export type AuthenticationResult = {
  investor: InvestorProfile;
  accessToken: string;
  refreshToken: string;
};

export class AuthenticateInvestorUseCase {
  constructor(
    private readonly investorRepository: IInvestorRepository,
    private readonly hashProvider: IHashProvider,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(
    data: AuthenticateInvestorInput,
  ): Promise<AuthenticationResult> {
    const investor = await this.investorRepository.findByEmail(data.email);

    if (!investor) {
      throw new AppError('Credenciais invalidas.', 401);
    }

    const passwordMatches = await this.hashProvider.compare(
      data.password,
      investor.password,
    );

    if (!passwordMatches) {
      throw new AppError('Credenciais invalidas.', 401);
    }

    return this.createSession(investor);
  }

  private createSession(investor: Investor): AuthenticationResult {
    const payload = {
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
      accessToken: this.tokenProvider.createAccessToken(payload),
      refreshToken: this.tokenProvider.createRefreshToken(payload),
    };
  }
}
