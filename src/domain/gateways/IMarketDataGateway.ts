import { AssetType } from '../entities/Asset.js';

export type ExternalAssetDetails = {
  ticker: string;
  name: string;
  type: AssetType;
  currency: string;
  exchange?: string;
  price?: number;
  marketState?: string;
};

export interface IMarketDataGateway {
  findByTicker(ticker: string): Promise<ExternalAssetDetails | null>;
}
