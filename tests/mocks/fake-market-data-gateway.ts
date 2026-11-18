import { ExternalAssetDetails } from '@domain/gateways/IMarketDataGateway.js';
import { IMarketDataGateway } from '@domain/gateways/IMarketDataGateway.js';

export class FakeMarketDataGateway implements IMarketDataGateway {
  public readonly assets = new Map<string, ExternalAssetDetails>();

  async findByTicker(ticker: string): Promise<ExternalAssetDetails | null> {
    return this.assets.get(ticker) ?? null;
  }
}
