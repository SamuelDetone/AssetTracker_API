import { Asset } from '../../domain/entities/Asset.js';
import { AppError } from '../../domain/errors/AppError.js';
import { IAssetRepository } from '../../domain/repositories/IAssetRepository.js';

export class GetAssetByTickerUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(ticker: string): Promise<Asset> {
    const asset = await this.assetRepository.findByTicker(ticker);

    if (!asset) {
      throw new AppError('Asset not found.', 404);
    }

    return asset;
  }
}
