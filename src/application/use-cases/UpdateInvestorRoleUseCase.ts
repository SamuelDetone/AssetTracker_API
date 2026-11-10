import {
  InvestorProfile,
  InvestorRole,
} from '../../domain/entities/Investor.js';
import { AppError } from '../../domain/errors/AppError.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';

export class UpdateInvestorRoleUseCase {
  constructor(private readonly investorRepository: IInvestorRepository) {}

  async execute(
    investorId: string,
    role: InvestorRole,
  ): Promise<InvestorProfile> {
    const investor = await this.investorRepository.updateRole(investorId, role);

    if (!investor) {
      throw new AppError('Investidor nao encontrado.', 404);
    }

    return {
      id: investor.id,
      name: investor.name,
      email: investor.email,
      role: investor.role,
    };
  }
}
