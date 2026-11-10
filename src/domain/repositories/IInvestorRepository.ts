import {
  CreateInvestorInput,
  Investor,
  InvestorRole,
} from '../entities/Investor.js';

export interface IInvestorRepository {
  create(data: CreateInvestorInput): Promise<Investor>;
  findById(id: string): Promise<Investor | null>;
  findByEmail(email: string): Promise<Investor | null>;
  updateRole(id: string, role: InvestorRole): Promise<Investor | null>;
}
