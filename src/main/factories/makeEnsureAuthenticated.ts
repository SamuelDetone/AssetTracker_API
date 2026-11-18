import { PrismaTokenRepository } from '../../infrastructure/database/prisma/PrismaTokenRepository.js';
import { ensureAuthenticated } from '../../infrastructure/http/middlewares/ensureAuthenticated.js';
import { JwtTokenProvider } from '../../infrastructure/providers/JwtTokenProvider.js';

export function makeEnsureAuthenticated() {
  return ensureAuthenticated(
    new JwtTokenProvider(),
    new PrismaTokenRepository(),
  );
}
