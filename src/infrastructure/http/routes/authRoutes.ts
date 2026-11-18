import { Router } from 'express';

import { makeAuthController } from '../../../main/factories/makeAuthController.js';
import { makeEnsureAuthenticated } from '../../../main/factories/makeEnsureAuthenticated.js';
import { authRateLimiter } from '../middlewares/rateLimiters.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginSchema } from '../schemas/authSchemas.js';

const authRoutes = Router();
const authController = makeAuthController();
const ensureAuthenticated = makeEnsureAuthenticated();

authRoutes.post(
  '/auth/login',
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  authController.login,
);
authRoutes.post('/auth/refresh-token', authRateLimiter, authController.refresh);
authRoutes.get('/auth/me', ensureAuthenticated, authController.me);
authRoutes.post('/auth/logout', ensureAuthenticated, authController.logout);

export { authRoutes };
