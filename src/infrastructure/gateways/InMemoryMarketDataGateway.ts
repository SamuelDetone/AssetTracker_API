import {
  ExternalAssetDetails,
  IMarketDataGateway,
} from '../../domain/gateways/IMarketDataGateway.js';

export class InMemoryMarketDataGateway implements IMarketDataGateway {
  private readonly assets: ExternalAssetDetails[] = [
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      currency: 'USD',
      exchange: 'NASDAQ',
      price: 180.5,
      marketState: 'REGULAR',
    },
    {
      ticker: 'PETR4.SA',
      name: 'Petrobras PN',
      currency: 'BRL',
      exchange: 'B3',
      price: 35.75,
      marketState: 'REGULAR',
    },
    {
      ticker: 'MCHI',
      name: 'iShares MSCI China ETF',
      currency: 'USD',
      exchange: 'NASDAQ',
      price: 45.2,
      marketState: 'REGULAR',
    },
  ];

  async findByTicker(ticker: string): Promise<ExternalAssetDetails | null> {
    return (
      this.assets.find(
        (asset) => asset.ticker.toLowerCase() === ticker.toLowerCase(),
      ) ?? null
    );
  }
}
