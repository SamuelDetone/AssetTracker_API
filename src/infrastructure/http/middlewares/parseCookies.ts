import { NextFunction, Request, Response } from 'express';

export function parseCookies(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const rawCookies = request.headers.cookie;

  request.cookies = {};

  if (rawCookies) {
    for (const item of rawCookies.split(';')) {
      const [key, ...value] = item.trim().split('=');

      if (key && value.length > 0) {
        request.cookies[key] = decodeURIComponent(value.join('='));
      }
    }
  }

  next();
}
