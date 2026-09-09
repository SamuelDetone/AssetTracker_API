import { Asset, CreateAssetInput } from '../../domain/entities/Asset.js';
import { AppError } from '../../domain/errors/AppError.js';
import { IAssetRepository } from '../../domain/repositories/IAssetRepository.js';

export class CreateAssetUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(data: CreateAssetInput): Promise<Asset> {
    const assetAlreadyExists = await this.assetRepository.findByTicker(
      data.ticker,
    );

    if (assetAlreadyExists) {
      throw new AppError('Asset already exists.', 409);
    }

    return this.assetRepository.create(data);
  }
}
