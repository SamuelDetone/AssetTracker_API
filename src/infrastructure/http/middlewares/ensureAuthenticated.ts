import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../../domain/errors/AppError.js';
import { JwtTokenProvider } from '../../providers/JwtTokenProvider.js';

const tokenProvider = new JwtTokenProvider();

export function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new AppError('Token JWT nao fornecido.', 401);
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Formato de token JWT invalido.', 401);
  }

  try {
    const payload = tokenProvider.verifyAccessToken(token);

    request.user = {
      id: payload.subject,
      role: payload.role,
    };
  } catch {
    throw new AppError('Token JWT invalido ou expirado.', 401);
  }

  next();
}
