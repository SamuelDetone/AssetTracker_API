import { CorsOptions } from 'cors';

import { env } from '../../config/env.js';
import { AppError } from '../../../domain/errors/AppError.js';

const allowedOrigins = [env.FRONTEND_URL];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new AppError('Origem nao permitida pela politica de CORS.', 403));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
