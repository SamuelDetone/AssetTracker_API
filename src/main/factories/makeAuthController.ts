import { AuthenticateInvestorUseCase } from '../../application/use-cases/AuthenticateInvestorUseCase.js';
import { RefreshInvestorSessionUseCase } from '../../application/use-cases/RefreshInvestorSessionUseCase.js';
import { PrismaInvestorRepository } from '../../infrastructure/database/prisma/PrismaInvestorRepository.js';
import { AuthController } from '../../infrastructure/http/controllers/AuthController.js';
import { BcryptHashProvider } from '../../infrastructure/providers/BcryptHashProvider.js';
import { JwtTokenProvider } from '../../infrastructure/providers/JwtTokenProvider.js';

export function makeAuthController(): AuthController {
  const investorRepository = new PrismaInvestorRepository();
  const hashProvider = new BcryptHashProvider();
  const tokenProvider = new JwtTokenProvider();

  return new AuthController(
    new AuthenticateInvestorUseCase(
      investorRepository,
      hashProvider,
      tokenProvider,
    ),
    new RefreshInvestorSessionUseCase(investorRepository, tokenProvider),
  );
}
