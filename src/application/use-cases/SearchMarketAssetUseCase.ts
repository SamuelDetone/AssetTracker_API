import { ExternalAssetDetails } from '../../domain/gateways/IMarketDataGateway.js';
import { IMarketDataGateway } from '../../domain/gateways/IMarketDataGateway.js';

export class SearchMarketAssetUseCase {
  constructor(private readonly marketDataGateway: IMarketDataGateway) {}

  async execute(ticker: string): Promise<ExternalAssetDetails | null> {
    return this.marketDataGateway.findByTicker(ticker);
  }
}
