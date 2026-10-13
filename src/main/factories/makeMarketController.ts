import { SearchMarketAssetUseCase } from '../../application/use-cases/SearchMarketAssetUseCase.js';
import { MarketController } from '../../infrastructure/http/controllers/MarketController.js';
import { makeMarketDataGateway } from './makeMarketDataGateway.js';

const marketDataGateway = makeMarketDataGateway();

export function makeMarketController(): MarketController {
  return new MarketController(new SearchMarketAssetUseCase(marketDataGateway));
}
