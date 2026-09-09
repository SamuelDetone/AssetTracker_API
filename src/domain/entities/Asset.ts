export type AssetType = 'stock' | 'etf' | 'crypto' | 'fund' | 'reit';

export type Asset = {
  ticker: string;
  name: string;
  type: AssetType;
  currency: string;
  exchange?: string;
  quantity: number;
  averagePrice: number;
};

export type CreateAssetInput = Asset;

export type UpdateAssetInput = Partial<Omit<Asset, 'ticker'>>;
