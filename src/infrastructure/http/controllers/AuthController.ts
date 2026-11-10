import { Request, Response } from 'express';

import { AuthenticateInvestorUseCase } from '../../../application/use-cases/AuthenticateInvestorUseCase.js';
import { RefreshInvestorSessionUseCase } from '../../../application/use-cases/RefreshInvestorSessionUseCase.js';
import { AppError } from '../../../domain/errors/AppError.js';

export class AuthController {
  constructor(
    private readonly authenticateInvestorUseCase: AuthenticateInvestorUseCase,
    private readonly refreshInvestorSessionUseCase: RefreshInvestorSessionUseCase,
  ) {}

  login = async (request: Request, response: Response): Promise<Response> => {
    const session = await this.authenticateInvestorUseCase.execute(
      request.body,
    );

    this.setRefreshTokenCookie(response, session.refreshToken);

    return response.json({
      investor: session.investor,
      accessToken: session.accessToken,
    });
  };

  refresh = async (request: Request, response: Response): Promise<Response> => {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError('Refresh token nao fornecido.', 401);
    }

    const session =
      await this.refreshInvestorSessionUseCase.execute(refreshToken);

    this.setRefreshTokenCookie(response, session.refreshToken);

    return response.json({
      investor: session.investor,
      accessToken: session.accessToken,
    });
  };

  private setRefreshTokenCookie(
    response: Response,
    refreshToken: string,
  ): void {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}
