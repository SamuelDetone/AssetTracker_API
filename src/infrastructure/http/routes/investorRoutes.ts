import { Router } from 'express';

import { makeInvestorController } from '../../../main/factories/makeInvestorController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  addHoldingSchema,
  createInvestorSchema,
  investorIdParamsSchema,
} from '../schemas/investorSchemas.js';

const investorRoutes = Router();
const investorController = makeInvestorController();

investorRoutes.post(
  '/investors',
  validateRequest({ body: createInvestorSchema }),
  investorController.create,
);
investorRoutes.post(
  '/investors/:investorId/holdings',
  validateRequest({
    body: addHoldingSchema,
    params: investorIdParamsSchema,
  }),
  investorController.addHolding,
);
investorRoutes.get(
  '/investors/:investorId/portfolio',
  validateRequest({ params: investorIdParamsSchema }),
  investorController.listPortfolio,
);

export { investorRoutes };
