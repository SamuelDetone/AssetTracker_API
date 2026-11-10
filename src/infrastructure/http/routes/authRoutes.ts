import { Router } from 'express';

import { makeAuthController } from '../../../main/factories/makeAuthController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginSchema } from '../schemas/authSchemas.js';

const authRoutes = Router();
const authController = makeAuthController();

authRoutes.post(
  '/auth/login',
  validateRequest({ body: loginSchema }),
  authController.login,
);
authRoutes.post('/auth/refresh-token', authController.refresh);

export { authRoutes };
