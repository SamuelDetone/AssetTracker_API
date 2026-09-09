import {
  Asset,
  CreateAssetInput,
  UpdateAssetInput,
} from '../entities/Asset.js';

export type ListAssetFilters = {
  type?: string;
  currency?: string;
  exchange?: string;
};

export interface IAssetRepository {
  list(filters?: ListAssetFilters): Promise<Asset[]>;
  findByTicker(ticker: string): Promise<Asset | null>;
  create(data: CreateAssetInput): Promise<Asset>;
  update(ticker: string, data: UpdateAssetInput): Promise<Asset | null>;
  delete(ticker: string): Promise<boolean>;
}
