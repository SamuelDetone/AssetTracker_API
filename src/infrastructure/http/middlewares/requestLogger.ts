import { NextFunction, Request, Response } from 'express';

export function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  response.on('finish', () => {
    console.log(
      `[http] ${request.method} ${request.originalUrl} -> ${response.statusCode}`,
    );
  });

  next();
}
