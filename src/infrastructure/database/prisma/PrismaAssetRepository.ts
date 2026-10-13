import {
  Asset,
  CreateAssetInput,
  UpdateAssetInput,
} from '../../../domain/entities/Asset.js';
import {
  IAssetRepository,
  ListAssetFilters,
} from '../../../domain/repositories/IAssetRepository.js';
import { prisma } from './client.js';

type PrismaAsset = {
  ticker: string;
  name: string;
  type: string;
  currency: string;
  exchange: string | null;
  quantity: unknown;
  averagePrice: unknown;
};

export class PrismaAssetRepository implements IAssetRepository {
  async list(filters?: ListAssetFilters): Promise<Asset[]> {
    const assets = await prisma.asset.findMany({
      orderBy: {
        ticker: 'asc',
      },
      where: {
        type: filters?.type,
        currency: filters?.currency,
        exchange: filters?.exchange,
      },
    });

    return assets.map(this.mapPrismaAssetToDomain);
  }

  async findByTicker(ticker: string): Promise<Asset | null> {
    const asset = await prisma.asset.findFirst({
      where: {
        ticker: {
          equals: ticker,
          mode: 'insensitive',
        },
      },
    });

    return asset ? this.mapPrismaAssetToDomain(asset) : null;
  }

  async create(data: CreateAssetInput): Promise<Asset> {
    const asset = await prisma.asset.create({
      data: {
        ticker: data.ticker.toUpperCase(),
        name: data.name,
        type: data.type,
        currency: data.currency,
        exchange: data.exchange,
        quantity: data.quantity,
        averagePrice: data.averagePrice,
      },
    });

    return this.mapPrismaAssetToDomain(asset);
  }

  async update(ticker: string, data: UpdateAssetInput): Promise<Asset | null> {
    const currentAsset = await this.findByTicker(ticker);

    if (!currentAsset) {
      return null;
    }

    const asset = await prisma.asset.update({
      data: {
        name: data.name,
        type: data.type,
        currency: data.currency,
        exchange: data.exchange,
        quantity: data.quantity,
        averagePrice: data.averagePrice,
      },
      where: {
        ticker: currentAsset.ticker,
      },
    });

    return this.mapPrismaAssetToDomain(asset);
  }

  async delete(ticker: string): Promise<boolean> {
    const currentAsset = await this.findByTicker(ticker);

    if (!currentAsset) {
      return false;
    }

    await prisma.asset.delete({
      where: {
        ticker: currentAsset.ticker,
      },
    });

    return true;
  }

  private mapPrismaAssetToDomain(asset: PrismaAsset): Asset {
    return {
      ticker: asset.ticker,
      name: asset.name,
      type: asset.type as Asset['type'],
      currency: asset.currency,
      exchange: asset.exchange ?? undefined,
      quantity: Number(asset.quantity),
      averagePrice: Number(asset.averagePrice),
    };
  }
}
