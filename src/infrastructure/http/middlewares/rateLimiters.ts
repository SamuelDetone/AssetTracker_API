import rateLimit, { MemoryStore } from 'express-rate-limit';

const apiRateLimitStore = new MemoryStore();
const authRateLimitStore = new MemoryStore();

function createLimitMessage(message: string) {
  return {
    status: 'error',
    statusCode: 429,
    message,
  };
}

export const apiRateLimiter = rateLimit({
  store: apiRateLimitStore,
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: createLimitMessage(
    'Muitas requisicoes originadas deste IP. Tente novamente em 15 minutos.',
  ),
});

export const authRateLimiter = rateLimit({
  store: authRateLimitStore,
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: createLimitMessage(
    'Muitas tentativas de autenticacao. Tente novamente em 5 minutos.',
  ),
});

export async function resetRateLimiters(): Promise<void> {
  await apiRateLimitStore.resetAll();
  await authRateLimitStore.resetAll();
}
