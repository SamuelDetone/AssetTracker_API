import rateLimit from 'express-rate-limit';

function createLimitMessage(message: string) {
  return {
    status: 'error',
    statusCode: 429,
    message,
  };
}

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: createLimitMessage(
    'Muitas requisicoes originadas deste IP. Tente novamente em 15 minutos.',
  ),
});

export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: createLimitMessage(
    'Muitas tentativas de autenticacao. Tente novamente em 5 minutos.',
  ),
});
