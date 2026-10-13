import { Router } from 'express';

import { makeMarketController } from '../../../main/factories/makeMarketController.js';

const marketRoutes = Router();
const marketController = makeMarketController();

marketRoutes.get('/market/search', marketController.search);

export { marketRoutes };
