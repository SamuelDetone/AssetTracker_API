import { InvestorProfile } from '../../domain/entities/Investor.js';
import { AppError } from '../../domain/errors/AppError.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';

export class GetCurrentInvestorUseCase {
  constructor(private readonly investorRepository: IInvestorRepository) {}

  async execute(investorId: string): Promise<InvestorProfile> {
    const investor = await this.investorRepository.findById(investorId);

    if (!investor) {
      throw new AppError('Investidor autenticado nao encontrado.', 404);
    }

    return {
      id: investor.id,
      name: investor.name,
      email: investor.email,
      role: investor.role,
    };
  }
}
