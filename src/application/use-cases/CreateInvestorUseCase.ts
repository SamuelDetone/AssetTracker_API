import {
  CreateInvestorInput,
  Investor,
} from '../../domain/entities/Investor.js';
import { IInvestorRepository } from '../../domain/repositories/IInvestorRepository.js';

export class CreateInvestorUseCase {
  constructor(private readonly investorRepository: IInvestorRepository) {}

  async execute(data: CreateInvestorInput): Promise<Investor> {
    return this.investorRepository.create(data);
  }
}
