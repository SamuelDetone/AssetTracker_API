import { IMarketDataGateway } from '../../domain/gateways/IMarketDataGateway.js';
import { InMemoryMarketDataGateway } from '../../infrastructure/gateways/InMemoryMarketDataGateway.js';
import { YahooFinanceGateway } from '../../infrastructure/gateways/YahooFinanceGateway.js';

export function makeMarketDataGateway(): IMarketDataGateway {
  const useExternalMarketApi = process.env.USE_EXTERNAL_MARKET_API !== 'false';

  return useExternalMarketApi
    ? new YahooFinanceGateway()
    : new InMemoryMarketDataGateway();
}
