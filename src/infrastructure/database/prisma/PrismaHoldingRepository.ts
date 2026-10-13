import { Asset } from '../../../domain/entities/Asset.js';
import {
  CreateHoldingInput,
  Holding,
} from '../../../domain/entities/Holding.js';
import { IHoldingRepository } from '../../../domain/repositories/IHoldingRepository.js';
import { prisma } from './client.js';

type PrismaHolding = {
  id: string;
  investorId: string;
  assetTicker: string;
  quantity: unknown;
  active: boolean;
  asset?: {
    ticker: string;
    name: string;
    type: string;
    currency: string;
    exchange: string | null;
    quantity: unknown;
    averagePrice: unknown;
  };
};

export class PrismaHoldingRepository implements IHoldingRepository {
  async create(data: CreateHoldingInput): Promise<Holding> {
    const holding = await prisma.holding.create({
      data: {
        investorId: data.investorId,
        assetTicker: data.assetTicker,
        quantity: data.quantity,
      },
      include: {
        asset: true,
      },
    });

    return this.mapPrismaHoldingToDomain(holding);
  }

  async countActiveByInvestorId(investorId: string): Promise<number> {
    return prisma.holding.count({
      where: {
        active: true,
        investorId,
      },
    });
  }

  async listActiveByInvestorId(investorId: string): Promise<Holding[]> {
    const holdings = await prisma.holding.findMany({
      include: {
        asset: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        active: true,
        investorId,
      },
    });

    return holdings.map(this.mapPrismaHoldingToDomain);
  }

  private mapPrismaHoldingToDomain(holding: PrismaHolding): Holding {
    return {
      id: holding.id,
      investorId: holding.investorId,
      assetTicker: holding.assetTicker,
      quantity: Number(holding.quantity),
      active: holding.active,
      asset: holding.asset
        ? ({
            ticker: holding.asset.ticker,
            name: holding.asset.name,
            type: holding.asset.type,
            currency: holding.asset.currency,
            exchange: holding.asset.exchange ?? undefined,
            quantity: Number(holding.asset.quantity),
            averagePrice: Number(holding.asset.averagePrice),
          } as Asset)
        : undefined,
    };
  }
}
