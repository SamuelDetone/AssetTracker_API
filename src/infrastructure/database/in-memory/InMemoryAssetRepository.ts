import {
  Asset,
  CreateAssetInput,
  UpdateAssetInput,
} from '../../../domain/entities/Asset.js';
import {
  IAssetRepository,
  ListAssetFilters,
} from '../../../domain/repositories/IAssetRepository.js';

export class InMemoryAssetRepository implements IAssetRepository {
  private assets: Asset[] = [
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      currency: 'USD',
      exchange: 'NASDAQ',
      quantity: 10,
      averagePrice: 180.5,
    },
    {
      ticker: 'PETR4.SA',
      name: 'Petrobras PN',
      type: 'stock',
      currency: 'BRL',
      exchange: 'B3',
      quantity: 20,
      averagePrice: 35.75,
    },
    {
      ticker: 'BTC-USD',
      name: 'Bitcoin',
      type: 'crypto',
      currency: 'USD',
      exchange: 'Yahoo Finance',
      quantity: 0.05,
      averagePrice: 65000,
    },
    {
      ticker: 'MCHI',
      name: 'iShares MSCI China ETF',
      type: 'etf',
      currency: 'USD',
      exchange: 'NASDAQ',
      quantity: 6,
      averagePrice: 45.2,
    },
  ];

  async list(filters?: ListAssetFilters): Promise<Asset[]> {
    return this.assets.filter((asset) => {
      const matchesType = filters?.type
        ? asset.type.toLowerCase() === filters.type.toLowerCase()
        : true;
      const matchesCurrency = filters?.currency
        ? asset.currency.toLowerCase() === filters.currency.toLowerCase()
        : true;
      const matchesExchange = filters?.exchange
        ? asset.exchange?.toLowerCase() === filters.exchange.toLowerCase()
        : true;

      return matchesType && matchesCurrency && matchesExchange;
    });
  }

  async findByTicker(ticker: string): Promise<Asset | null> {
    return (
      this.assets.find(
        (asset) => asset.ticker.toLowerCase() === ticker.toLowerCase(),
      ) ?? null
    );
  }

  async create(data: CreateAssetInput): Promise<Asset> {
    const asset: Asset = {
      ...data,
      ticker: data.ticker.toUpperCase(),
    };

    this.assets.push(asset);

    return asset;
  }

  async update(ticker: string, data: UpdateAssetInput): Promise<Asset | null> {
    const assetIndex = this.assets.findIndex(
      (asset) => asset.ticker.toLowerCase() === ticker.toLowerCase(),
    );

    if (assetIndex === -1) {
      return null;
    }

    const currentAsset = this.assets[assetIndex];
    const updatedAsset: Asset = {
      ...currentAsset,
      ...data,
      ticker: currentAsset.ticker,
    };

    this.assets[assetIndex] = updatedAsset;

    return updatedAsset;
  }

  async delete(ticker: string): Promise<boolean> {
    const currentLength = this.assets.length;
    this.assets = this.assets.filter(
      (asset) => asset.ticker.toLowerCase() !== ticker.toLowerCase(),
    );

    return this.assets.length < currentLength;
  }
}
