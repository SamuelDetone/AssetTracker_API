import { AppError } from '../../domain/errors/AppError.js';
import { IAssetRepository } from '../../domain/repositories/IAssetRepository.js';

export class DeleteAssetUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(ticker: string): Promise<void> {
    const assetWasDeleted = await this.assetRepository.delete(ticker);

    if (!assetWasDeleted) {
      throw new AppError('Asset not found.', 404);
    }
  }
}
