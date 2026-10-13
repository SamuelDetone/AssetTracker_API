import axios, { AxiosError } from 'axios';

import { AppError } from '../../domain/errors/AppError.js';
import {
  ExternalAssetDetails,
  IMarketDataGateway,
} from '../../domain/gateways/IMarketDataGateway.js';

type YahooQuoteResponse = {
  quoteResponse?: {
    result?: Array<{
      currency?: string;
      fullExchangeName?: string;
      longName?: string;
      marketState?: string;
      regularMarketPrice?: number;
      shortName?: string;
      symbol?: string;
    }>;
  };
};

export class YahooFinanceGateway implements IMarketDataGateway {
  private readonly baseUrl =
    process.env.MARKET_API_BASE_URL ??
    'https://query1.finance.yahoo.com/v7/finance';

  async findByTicker(ticker: string): Promise<ExternalAssetDetails | null> {
    try {
      const response = await axios.get<YahooQuoteResponse>(
        `${this.baseUrl}/quote`,
        {
          params: {
            symbols: ticker,
          },
          timeout: 3000,
        },
      );

      const quote = response.data.quoteResponse?.result?.[0];

      if (!quote?.symbol) {
        return null;
      }

      return {
        ticker: quote.symbol,
        name: quote.longName ?? quote.shortName ?? quote.symbol,
        currency: quote.currency ?? 'USD',
        exchange: quote.fullExchangeName,
        price: quote.regularMarketPrice,
        marketState: quote.marketState,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }

      throw new AppError(
        'O servico externo de mercado esta temporariamente indisponivel. Tente novamente mais tarde.',
        503,
      );
    }
  }
}
