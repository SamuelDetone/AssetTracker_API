import {
  CreateInvestorInput,
  Investor,
  InvestorRole,
} from '../../../domain/entities/Investor.js';
import { IInvestorRepository } from '../../../domain/repositories/IInvestorRepository.js';
import { prisma } from './client.js';

export class PrismaInvestorRepository implements IInvestorRepository {
  async create(data: CreateInvestorInput): Promise<Investor> {
    return prisma.investor.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        role: 'USER',
      },
    });
  }

  async findById(id: string): Promise<Investor | null> {
    return prisma.investor.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<Investor | null> {
    return prisma.investor.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async updateRole(id: string, role: InvestorRole): Promise<Investor | null> {
    const investor = await this.findById(id);

    if (!investor) {
      return null;
    }

    return prisma.investor.update({
      where: { id },
      data: { role },
    });
  }
}
