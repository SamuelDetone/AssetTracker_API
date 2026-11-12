import { IMarketDataGateway } from '../../domain/gateways/IMarketDataGateway.js';
import { env } from '../../infrastructure/config/env.js';
import { FallbackMarketDataGateway } from '../../infrastructure/gateways/FallbackMarketDataGateway.js';
import { InMemoryMarketDataGateway } from '../../infrastructure/gateways/InMemoryMarketDataGateway.js';
import { YahooFinanceGateway } from '../../infrastructure/gateways/YahooFinanceGateway.js';

export function makeMarketDataGateway(): IMarketDataGateway {
  return env.USE_EXTERNAL_MARKET_API
    ? new FallbackMarketDataGateway(
        new YahooFinanceGateway(),
        new InMemoryMarketDataGateway(),
      )
    : new InMemoryMarketDataGateway();
}
