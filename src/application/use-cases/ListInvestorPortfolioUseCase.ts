import { Holding } from '../../domain/entities/Holding.js';
import { AppError } from '../../domain/errors/AppError.js';
import { IHoldingRepository } from '../../domain/repositories/IHoldingRepository.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';

export class ListInvestorPortfolioUseCase {
  constructor(
    private readonly investorRepository: IInvestorRepository,
    private readonly holdingRepository: IHoldingRepository,
  ) {}

  async execute(investorId: string): Promise<Holding[]> {
    const investor = await this.investorRepository.findById(investorId);

    if (!investor) {
      throw new AppError('Investor not found.', 404);
    }

    return this.holdingRepository.listActiveByInvestorId(investorId);
  }
}
