import { Asset, CreateAssetInput, UpdateAssetInput } from '@domain/entities/Asset.js';
import { IAssetRepository, ListAssetFilters } from '@domain/repositories/IAssetRepository.js';

export class InMemoryAssetRepository implements IAssetRepository {
  public readonly assets: Asset[] = [];

  async list(filters?: ListAssetFilters): Promise<Asset[]> {
    return this.assets.filter((asset) => {
      return (
        (!filters?.type || asset.type === filters.type) &&
        (!filters?.currency || asset.currency === filters.currency) &&
        (!filters?.exchange || asset.exchange === filters.exchange)
      );
    });
  }

  async findByTicker(ticker: string): Promise<Asset | null> {
    return this.assets.find((asset) => asset.ticker === ticker) ?? null;
  }

  async create(data: CreateAssetInput): Promise<Asset> {
    const asset = { ...data };

    this.assets.push(asset);

    return asset;
  }

  async update(ticker: string, data: UpdateAssetInput): Promise<Asset | null> {
    const asset = await this.findByTicker(ticker);

    if (!asset) {
      return null;
    }

    Object.assign(asset, data);

    return asset;
  }

  async delete(ticker: string): Promise<boolean> {
    const assetIndex = this.assets.findIndex((asset) => asset.ticker === ticker);

    if (assetIndex === -1) {
      return false;
    }

    this.assets.splice(assetIndex, 1);

    return true;
  }
}
