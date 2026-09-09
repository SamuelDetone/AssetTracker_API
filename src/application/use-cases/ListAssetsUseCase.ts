import { Asset } from '../../domain/entities/Asset.js';
import {
  IAssetRepository,
  ListAssetFilters,
} from '../../domain/repositories/IAssetRepository.js';

export class ListAssetsUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(filters?: ListAssetFilters): Promise<Asset[]> {
    return this.assetRepository.list(filters);
  }
}
