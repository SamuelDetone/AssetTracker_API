import { CreateInvestorInput, Investor } from '../entities/Investor.js';

export interface IInvestorRepository {
  create(data: CreateInvestorInput): Promise<Investor>;
  findById(id: string): Promise<Investor | null>;
  findByEmail(email: string): Promise<Investor | null>;
}
