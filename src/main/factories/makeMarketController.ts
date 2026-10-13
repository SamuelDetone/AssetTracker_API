import { SearchMarketAssetUseCase } from '../../application/use-cases/SearchMarketAssetUseCase.js';
import { InMemoryMarketDataGateway } from '../../infrastructure/gateways/InMemoryMarketDataGateway.js';
import { YahooFinanceGateway } from '../../infrastructure/gateways/YahooFinanceGateway.js';
import { MarketController } from '../../infrastructure/http/controllers/MarketController.js';

const useExternalMarketApi = process.env.USE_EXTERNAL_MARKET_API !== 'false';
const marketDataGateway = useExternalMarketApi
  ? new YahooFinanceGateway()
  : new InMemoryMarketDataGateway();

export function makeMarketController(): MarketController {
  return new MarketController(new SearchMarketAssetUseCase(marketDataGateway));
}
