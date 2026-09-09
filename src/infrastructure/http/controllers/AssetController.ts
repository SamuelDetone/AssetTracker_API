import { Request, Response } from 'express';

import { CreateAssetUseCase } from '../../../application/use-cases/CreateAssetUseCase.js';
import { DeleteAssetUseCase } from '../../../application/use-cases/DeleteAssetUseCase.js';
import { GetAssetByTickerUseCase } from '../../../application/use-cases/GetAssetByTickerUseCase.js';
import { ListAssetsUseCase } from '../../../application/use-cases/ListAssetsUseCase.js';
import { UpdateAssetUseCase } from '../../../application/use-cases/UpdateAssetUseCase.js';
import { AppError } from '../../../domain/errors/AppError.js';

export class AssetController {
  constructor(
    private readonly listAssetsUseCase: ListAssetsUseCase,
    private readonly getAssetByTickerUseCase: GetAssetByTickerUseCase,
    private readonly createAssetUseCase: CreateAssetUseCase,
    private readonly updateAssetUseCase: UpdateAssetUseCase,
    private readonly deleteAssetUseCase: DeleteAssetUseCase,
  ) {}

  list = async (request: Request, response: Response): Promise<Response> => {
    const type =
      typeof request.query.type === 'string' ? request.query.type : undefined;
    const currency =
      typeof request.query.currency === 'string'
        ? request.query.currency
        : undefined;
    const exchange =
      typeof request.query.exchange === 'string'
        ? request.query.exchange
        : undefined;

    const assets = await this.listAssetsUseCase.execute({
      type,
      currency,
      exchange,
    });

    return response.json(assets);
  };

  findByTicker = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const ticker = this.getTickerFromParams(request);
    const asset = await this.getAssetByTickerUseCase.execute(ticker);

    return response.json(asset);
  };

  create = async (request: Request, response: Response): Promise<Response> => {
    const asset = await this.createAssetUseCase.execute(request.body);

    return response.status(201).json(asset);
  };

  update = async (request: Request, response: Response): Promise<Response> => {
    const ticker = this.getTickerFromParams(request);
    const asset = await this.updateAssetUseCase.execute(ticker, request.body);

    return response.json(asset);
  };

  delete = async (request: Request, response: Response): Promise<Response> => {
    const ticker = this.getTickerFromParams(request);
    await this.deleteAssetUseCase.execute(ticker);

    return response.status(204).send();
  };

  private getTickerFromParams(request: Request): string {
    const ticker = request.params.ticker;

    if (!ticker || Array.isArray(ticker)) {
      throw new AppError('Invalid asset ticker.', 400);
    }

    return ticker;
  }
}
