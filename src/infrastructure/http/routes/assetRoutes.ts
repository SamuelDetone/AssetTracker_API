import { Router } from 'express';

import { makeAssetController } from '../../../main/factories/makeAssetController.js';

const assetRoutes = Router();
const assetController = makeAssetController();

assetRoutes.get('/assets', assetController.list);
assetRoutes.get('/assets/:ticker', assetController.findByTicker);
assetRoutes.post('/assets', assetController.create);
assetRoutes.put('/assets/:ticker', assetController.update);
assetRoutes.delete('/assets/:ticker', assetController.delete);

export { assetRoutes };
