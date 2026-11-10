import { NextFunction, Request, Response } from 'express';

import { InvestorRole } from '../../../domain/entities/Investor.js';
import { AppError } from '../../../domain/errors/AppError.js';

export function ensureRole(allowedRoles: InvestorRole[]) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      throw new AppError('Usuario nao autenticado.', 401);
    }

    if (!allowedRoles.includes(request.user.role)) {
      throw new AppError('Acesso nao autorizado para este recurso.', 403);
    }

    next();
  };
}
