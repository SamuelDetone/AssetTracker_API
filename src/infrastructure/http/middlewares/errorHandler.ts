import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../../../domain/errors/AppError.js';

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  if (error instanceof ZodError) {
    return response.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada invalidos.',
      details: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Erro interno no servidor.',
  });
}
