import { Router } from 'express';

import { makeEnsureAuthenticated } from '../../../main/factories/makeEnsureAuthenticated.js';
import { makeInvestorController } from '../../../main/factories/makeInvestorController.js';
import { ensureRole } from '../middlewares/ensureRole.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  addHoldingSchema,
  createInvestorSchema,
  investorIdParamsSchema,
  updateInvestorRoleSchema,
} from '../schemas/investorSchemas.js';

const investorRoutes = Router();
const investorController = makeInvestorController();
const ensureAuthenticated = makeEnsureAuthenticated();

investorRoutes.post(
  '/investors',
  validateRequest({ body: createInvestorSchema }),
  investorController.create,
);
investorRoutes.patch(
  '/investors/:investorId/role',
  ensureAuthenticated,
  ensureRole(['ADMIN']),
  validateRequest({
    body: updateInvestorRoleSchema,
    params: investorIdParamsSchema,
  }),
  investorController.updateRole,
);
investorRoutes.post(
  '/investors/:investorId/holdings',
  ensureAuthenticated,
  validateRequest({
    body: addHoldingSchema,
    params: investorIdParamsSchema,
  }),
  investorController.addHolding,
);
investorRoutes.get(
  '/investors/:investorId/portfolio',
  ensureAuthenticated,
  validateRequest({ params: investorIdParamsSchema }),
  investorController.listPortfolio,
);

export { investorRoutes };
