import {
  CreateInvestorInput,
  Investor,
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
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findById(id: string): Promise<Investor | null> {
    return prisma.investor.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<Investor | null> {
    return prisma.investor.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        email: email.toLowerCase(),
      },
    });
  }
}
