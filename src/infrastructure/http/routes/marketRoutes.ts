import { Router } from 'express';

import { makeMarketController } from '../../../main/factories/makeMarketController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { searchMarketQuerySchema } from '../schemas/marketSchemas.js';

const marketRoutes = Router();
const marketController = makeMarketController();

marketRoutes.get(
  '/market/search',
  validateRequest({ query: searchMarketQuerySchema }),
  marketController.search,
);

export { marketRoutes };
