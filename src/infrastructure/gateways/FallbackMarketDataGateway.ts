import {
  ExternalAssetDetails,
  IMarketDataGateway,
} from '../../domain/gateways/IMarketDataGateway.js';

export class FallbackMarketDataGateway implements IMarketDataGateway {
  constructor(
    private readonly primaryGateway: IMarketDataGateway,
    private readonly fallbackGateway: IMarketDataGateway,
  ) {}

  async findByTicker(ticker: string): Promise<ExternalAssetDetails | null> {
    try {
      const asset = await this.primaryGateway.findByTicker(ticker);

      if (asset) {
        return asset;
      }
    } catch {
      return this.fallbackGateway.findByTicker(ticker);
    }

    return this.fallbackGateway.findByTicker(ticker);
  }
}
