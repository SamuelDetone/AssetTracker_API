import { CreateInvestorInput, Investor, InvestorProfile } from '../../domain/entities/Investor.js';
import { AppError } from '../../domain/errors/AppError.js';
import { IHashProvider } from '../../domain/providers/IHashProvider.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';

export class CreateInvestorUseCase {
  constructor(
    private readonly investorRepository: IInvestorRepository,
    private readonly hashProvider: IHashProvider,
  ) {}

  async execute(data: CreateInvestorInput): Promise<InvestorProfile> {
    const investorAlreadyExists = await this.investorRepository.findByEmail(data.email);

    if (investorAlreadyExists) {
      throw new AppError('Ja existe um investidor cadastrado com este e-mail.', 409);
    }

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
