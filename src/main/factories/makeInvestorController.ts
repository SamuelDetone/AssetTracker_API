import { AddHoldingToPortfolioUseCase } from '../../application/use-cases/AddHoldingToPortfolioUseCase.js';
import { CreateInvestorUseCase } from '../../application/use-cases/CreateInvestorUseCase.js';
import { ListInvestorPortfolioUseCase } from '../../application/use-cases/ListInvestorPortfolioUseCase.js';
import { UpdateInvestorRoleUseCase } from '../../application/use-cases/UpdateInvestorRoleUseCase.js';
import { PrismaAssetRepository } from '../../infrastructure/database/prisma/PrismaAssetRepository.js';
import { PrismaHoldingRepository } from '../../infrastructure/database/prisma/PrismaHoldingRepository.js';
import { PrismaInvestorRepository } from '../../infrastructure/database/prisma/PrismaInvestorRepository.js';
import { InvestorController } from '../../infrastructure/http/controllers/InvestorController.js';
import { BcryptHashProvider } from '../../infrastructure/providers/BcryptHashProvider.js';
import { makeMarketDataGateway } from './makeMarketDataGateway.js';

const investorRepository = new PrismaInvestorRepository();
const assetRepository = new PrismaAssetRepository();
const holdingRepository = new PrismaHoldingRepository();
const marketDataGateway = makeMarketDataGateway();
const hashProvider = new BcryptHashProvider();

export function makeInvestorController(): InvestorController {
  return new InvestorController(
    new CreateInvestorUseCase(investorRepository, hashProvider),
    new AddHoldingToPortfolioUseCase(
      investorRepository,
      assetRepository,
      holdingRepository,
      marketDataGateway,
    ),
    new ListInvestorPortfolioUseCase(investorRepository, holdingRepository),
    new UpdateInvestorRoleUseCase(investorRepository),
  );
}
