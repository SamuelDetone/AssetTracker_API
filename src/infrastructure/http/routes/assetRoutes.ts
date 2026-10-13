import { Router } from 'express';

import { makeAssetController } from '../../../main/factories/makeAssetController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  assetTickerParamsSchema,
  createAssetSchema,
  listAssetsQuerySchema,
  updateAssetSchema,
} from '../schemas/assetSchemas.js';

const assetRoutes = Router();
const assetController = makeAssetController();

assetRoutes.get(
  '/assets',
  validateRequest({ query: listAssetsQuerySchema }),
  assetController.list,
);
assetRoutes.get(
  '/assets/:ticker',
  validateRequest({ params: assetTickerParamsSchema }),
  assetController.findByTicker,
);
assetRoutes.post(
  '/assets',
  validateRequest({ body: createAssetSchema }),
  assetController.create,
);
assetRoutes.put(
  '/assets/:ticker',
  validateRequest({
    body: updateAssetSchema,
    params: assetTickerParamsSchema,
  }),
  assetController.update,
);
assetRoutes.delete(
  '/assets/:ticker',
  validateRequest({ params: assetTickerParamsSchema }),
  assetController.delete,
);

export { assetRoutes };
