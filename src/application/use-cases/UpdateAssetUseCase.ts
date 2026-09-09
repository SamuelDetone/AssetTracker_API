import { Asset, UpdateAssetInput } from '../../domain/entities/Asset.js';
import { AppError } from '../../domain/errors/AppError.js';
import { IAssetRepository } from '../../domain/repositories/IAssetRepository.js';

export class UpdateAssetUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(ticker: string, data: UpdateAssetInput): Promise<Asset> {
    const asset = await this.assetRepository.update(ticker, data);

    if (!asset) {
      throw new AppError('Asset not found.', 404);
    }

    return asset;
  }
}
