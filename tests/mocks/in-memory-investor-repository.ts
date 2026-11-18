import { randomUUID } from 'node:crypto';

import {
  CreateInvestorInput,
  Investor,
  InvestorRole,
} from '@domain/entities/Investor.js';
import { IInvestorRepository } from '@domain/repositories/IInvestorRepository.js';

export class InMemoryInvestorRepository implements IInvestorRepository {
  public readonly investors: Investor[] = [];

  async create(data: CreateInvestorInput): Promise<Investor> {
    const investor: Investor = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: 'USER',
    };

    this.investors.push(investor);

    return investor;
  }

  async findById(id: string): Promise<Investor | null> {
    return this.investors.find((investor) => investor.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<Investor | null> {
    return (
      this.investors.find(
        (investor) => investor.email === email.toLowerCase(),
      ) ?? null
    );
  }

  async updateRole(id: string, role: InvestorRole): Promise<Investor | null> {
    const investor = await this.findById(id);

    if (!investor) {
      return null;
    }

    investor.role = role;

    return investor;
  }
}
