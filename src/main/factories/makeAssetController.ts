import { CreateAssetUseCase } from '../../application/use-cases/CreateAssetUseCase.js';
import { DeleteAssetUseCase } from '../../application/use-cases/DeleteAssetUseCase.js';
import { GetAssetByTickerUseCase } from '../../application/use-cases/GetAssetByTickerUseCase.js';
import { ListAssetsUseCase } from '../../application/use-cases/ListAssetsUseCase.js';
import { UpdateAssetUseCase } from '../../application/use-cases/UpdateAssetUseCase.js';
import { PrismaAssetRepository } from '../../infrastructure/database/prisma/PrismaAssetRepository.js';
import { AssetController } from '../../infrastructure/http/controllers/AssetController.js';

const assetRepository = new PrismaAssetRepository();

export function makeAssetController(): AssetController {
  return new AssetController(
    new ListAssetsUseCase(assetRepository),
    new GetAssetByTickerUseCase(assetRepository),
    new CreateAssetUseCase(assetRepository),
    new UpdateAssetUseCase(assetRepository),
    new DeleteAssetUseCase(assetRepository),
  );
}
