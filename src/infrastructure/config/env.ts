import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3333),
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL valida.'),
  FRONTEND_URL: z.string().url('FRONTEND_URL deve ser uma URL valida.'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET deve ter no minimo 32 caracteres.'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET deve ter no minimo 32 caracteres.'),
  USE_EXTERNAL_MARKET_API: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  MARKET_API_BASE_URL: z
    .string()
    .url('MARKET_API_BASE_URL deve ser uma URL valida.')
    .default('https://query1.finance.yahoo.com/v7/finance'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Variaveis de ambiente invalidas ou ausentes:');
  console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = result.data;
