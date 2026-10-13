import { z } from 'zod';

export const searchMarketQuerySchema = z.object({
  ticker: z
    .string()
    .trim()
    .min(1, 'O ticker e obrigatorio.')
    .max(20, 'O ticker deve ter no maximo 20 caracteres.')
    .transform((ticker) => ticker.toUpperCase()),
});

export type SearchMarketQuerySchema = z.infer<typeof searchMarketQuerySchema>;
