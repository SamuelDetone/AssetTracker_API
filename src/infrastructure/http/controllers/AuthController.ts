import { Request, Response } from 'express';

import { AuthenticateInvestorUseCase } from '../../../application/use-cases/AuthenticateInvestorUseCase.js';
import { GetCurrentInvestorUseCase } from '../../../application/use-cases/GetCurrentInvestorUseCase.js';
import { LogoutInvestorUseCase } from '../../../application/use-cases/LogoutInvestorUseCase.js';
import { RefreshInvestorSessionUseCase } from '../../../application/use-cases/RefreshInvestorSessionUseCase.js';
import { AppError } from '../../../domain/errors/AppError.js';
import { env } from '../../config/env.js';

export class AuthController {
  constructor(
    private readonly authenticateInvestorUseCase: AuthenticateInvestorUseCase,
    private readonly refreshInvestorSessionUseCase: RefreshInvestorSessionUseCase,
    private readonly getCurrentInvestorUseCase: GetCurrentInvestorUseCase,
    private readonly logoutInvestorUseCase: LogoutInvestorUseCase,
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

  me = async (request: Request, response: Response): Promise<Response> => {
    if (!request.user) {
      throw new AppError('Usuario nao autenticado.', 401);
    }

    const investor = await this.getCurrentInvestorUseCase.execute(
      request.user.id,
    );

    return response.json({ investor });
  };

  logout = async (request: Request, response: Response): Promise<Response> => {
    if (!request.user || !request.accessToken) {
      throw new AppError('Usuario nao autenticado.', 401);
    }

    await this.logoutInvestorUseCase.execute(
      request.user.id,
      request.accessToken,
    );

    this.clearRefreshTokenCookie(response);

    return response.status(204).send();
  };

  private setRefreshTokenCookie(
    response: Response,
    refreshToken: string,
  ): void {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
    });
  }

  private clearRefreshTokenCookie(response: Response): void {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
    });
  }
}
