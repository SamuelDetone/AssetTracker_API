import { randomUUID } from 'node:crypto';

import { CreateHoldingInput, Holding } from '@domain/entities/Holding.js';
import { IHoldingRepository } from '@domain/repositories/IHoldingRepository.js';

export class InMemoryHoldingRepository implements IHoldingRepository {
  public readonly holdings: Holding[] = [];

  async create(data: CreateHoldingInput): Promise<Holding> {
    const holding: Holding = {
      id: randomUUID(),
      investorId: data.investorId,
      assetTicker: data.assetTicker,
      quantity: data.quantity,
      active: true,
    };

    this.holdings.push(holding);

    return holding;
  }

  async countActiveByInvestorId(investorId: string): Promise<number> {
    return this.holdings.filter((holding) => holding.investorId === investorId && holding.active)
      .length;
  }

  async listActiveByInvestorId(investorId: string): Promise<Holding[]> {
    return this.holdings.filter((holding) => holding.investorId === investorId && holding.active);
  }
}
