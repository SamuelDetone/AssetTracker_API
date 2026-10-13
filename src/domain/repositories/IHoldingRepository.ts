import { CreateHoldingInput, Holding } from '../entities/Holding.js';

export interface IHoldingRepository {
  create(data: CreateHoldingInput): Promise<Holding>;
  countActiveByInvestorId(investorId: string): Promise<number>;
  listActiveByInvestorId(investorId: string): Promise<Holding[]>;
}
