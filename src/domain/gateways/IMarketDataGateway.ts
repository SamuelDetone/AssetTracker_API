export type ExternalAssetDetails = {
  ticker: string;
  name: string;
  currency: string;
  exchange?: string;
  price?: number;
  marketState?: string;
};

export interface IMarketDataGateway {
  findByTicker(ticker: string): Promise<ExternalAssetDetails | null>;
}
