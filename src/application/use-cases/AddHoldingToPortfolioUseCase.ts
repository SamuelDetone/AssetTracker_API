import { Holding } from '../../domain/entities/Holding.js';
import { AppError } from '../../domain/errors/AppError.js';
import { IAssetRepository } from '../../domain/repositories/IAssetRepository.js';
import { IHoldingRepository } from '../../domain/repositories/IHoldingRepository.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';

type AddHoldingToPortfolioInput = {
  investorId: string;
  ticker: string;
  quantity: number;
};

export class AddHoldingToPortfolioUseCase {
  constructor(
    private readonly investorRepository: IInvestorRepository,
    private readonly assetRepository: IAssetRepository,
    private readonly holdingRepository: IHoldingRepository,
  ) {}

  async execute(data: AddHoldingToPortfolioInput): Promise<Holding> {
    const investor = await this.investorRepository.findById(data.investorId);

    if (!investor) {
      throw new AppError('Investor not found.', 404);
    }

    const activeHoldingsCount =
      await this.holdingRepository.countActiveByInvestorId(data.investorId);

    if (activeHoldingsCount >= 6) {
      throw new AppError(
        'O investidor ja possui o limite maximo de 6 ativos na carteira ativa.',
        409,
      );
    }

    const asset = await this.assetRepository.findByTicker(data.ticker);

    if (!asset) {
      throw new AppError('Asset not found.', 404);
    }

    return this.holdingRepository.create({
      investorId: data.investorId,
      assetTicker: asset.ticker,
      quantity: data.quantity,
    });
  }
}
