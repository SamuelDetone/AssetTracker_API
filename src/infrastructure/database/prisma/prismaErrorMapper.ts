import { Prisma } from '@prisma/client';

import { AppError } from '../../../domain/errors/AppError.js';

export function mapPrismaError(error: Error): AppError | null {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    if (error.errorCode === 'P1000') {
      return new AppError(
        'Falha de autenticacao com o banco de dados. Verifique DATABASE_URL, usuario e senha.',
        503,
      );
    }

    if (error.errorCode === 'P1001') {
      return new AppError(
        'Nao foi possivel conectar ao banco de dados. Verifique se o Postgres esta rodando.',
        503,
      );
    }

    return new AppError(
      'Banco de dados indisponivel no momento. Verifique a configuracao do Prisma.',
      503,
    );
  }

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
