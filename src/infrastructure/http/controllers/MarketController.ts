import { Request, Response } from 'express';

import { SearchMarketAssetUseCase } from '../../../application/use-cases/SearchMarketAssetUseCase.js';
import { AppError } from '../../../domain/errors/AppError.js';

export class MarketController {
  constructor(
    private readonly searchMarketAssetUseCase: SearchMarketAssetUseCase,
  ) {}

  search = async (request: Request, response: Response): Promise<Response> => {
    const ticker =
      typeof request.query.ticker === 'string'
        ? request.query.ticker
        : undefined;

    if (!ticker) {
      throw new AppError('Ticker is required.', 400);
    }

    const asset = await this.searchMarketAssetUseCase.execute(ticker);

    if (!asset) {
      throw new AppError('Asset not found in market data provider.', 404);
    }

    return response.json(asset);
  };
}
