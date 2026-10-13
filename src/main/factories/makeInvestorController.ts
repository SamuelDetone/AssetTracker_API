import { AddHoldingToPortfolioUseCase } from '../../application/use-cases/AddHoldingToPortfolioUseCase.js';
import { CreateInvestorUseCase } from '../../application/use-cases/CreateInvestorUseCase.js';
import { ListInvestorPortfolioUseCase } from '../../application/use-cases/ListInvestorPortfolioUseCase.js';
import { PrismaAssetRepository } from '../../infrastructure/database/prisma/PrismaAssetRepository.js';
import { PrismaHoldingRepository } from '../../infrastructure/database/prisma/PrismaHoldingRepository.js';
import { PrismaInvestorRepository } from '../../infrastructure/database/prisma/PrismaInvestorRepository.js';
import { InvestorController } from '../../infrastructure/http/controllers/InvestorController.js';

const investorRepository = new PrismaInvestorRepository();
const assetRepository = new PrismaAssetRepository();
const holdingRepository = new PrismaHoldingRepository();

export function makeInvestorController(): InvestorController {
  return new InvestorController(
    new CreateInvestorUseCase(investorRepository),
    new AddHoldingToPortfolioUseCase(
      investorRepository,
      assetRepository,
      holdingRepository,
    ),
    new ListInvestorPortfolioUseCase(investorRepository, holdingRepository),
  );
}
