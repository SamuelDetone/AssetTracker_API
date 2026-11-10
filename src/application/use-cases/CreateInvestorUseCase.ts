import {
  CreateInvestorInput,
  Investor,
  InvestorProfile,
} from '../../domain/entities/Investor.js';
import { IHashProvider } from '../../domain/providers/IHashProvider.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';

export class CreateInvestorUseCase {
  constructor(
    private readonly investorRepository: IInvestorRepository,
    private readonly hashProvider: IHashProvider,
  ) {}

  async execute(data: CreateInvestorInput): Promise<InvestorProfile> {
    const password = await this.hashProvider.hash(data.password);
    const investor = await this.investorRepository.create({
      ...data,
      password,
    });

    return this.toProfile(investor);
  }

  private toProfile(investor: Investor): InvestorProfile {
    return {
      id: investor.id,
      name: investor.name,
      email: investor.email,
      role: investor.role,
    };
  }
}
