import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../../domain/errors/AppError.js';
import { ITokenProvider } from '../../../domain/providers/ITokenProvider.js';
import { ITokenRepository } from '../../../domain/repositories/ITokenRepository.js';

export function ensureAuthenticated(
  tokenProvider: ITokenProvider,
  tokenRepository: ITokenRepository,
) {
  return async (
    request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new AppError('Token JWT nao fornecido.', 401);
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Formato de token JWT invalido.', 401);
    }

    if (await tokenRepository.isAccessTokenInvalidated(token)) {
      throw new AppError('Sessao encerrada. Faca login novamente.', 401);
    }

    try {
      const payload = tokenProvider.verifyAccessToken(token);

      request.user = {
        id: payload.subject,
        role: payload.role,
      };
      request.accessToken = token;
    } catch {
      throw new AppError('Token JWT invalido ou expirado.', 401);
    }

    next();
  };
}
