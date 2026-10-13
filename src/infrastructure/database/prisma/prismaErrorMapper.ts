import { Prisma } from '@prisma/client';

import { AppError } from '../../../domain/errors/AppError.js';

export function mapPrismaError(error: Error): AppError | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  if (error.code === 'P2002') {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(', ')
      : 'registro';

    return new AppError(
      `Ja existe um registro cadastrado para ${target}.`,
      409,
    );
  }

  if (error.code === 'P2003') {
    return new AppError(
      'Relacionamento invalido. O recurso associado nao existe.',
      400,
    );
  }

  if (error.code === 'P2025') {
    return new AppError('Registro nao encontrado no banco de dados.', 404);
  }

  return null;
}
