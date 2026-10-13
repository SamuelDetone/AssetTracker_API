import { z } from 'zod';

export const assetTypeSchema = z.enum([
  'stock',
  'etf',
  'crypto',
  'fund',
  'reit',
]);

export const createAssetSchema = z.object({
  ticker: z
    .string()
    .trim()
    .min(1, 'O ticker e obrigatorio.')
    .max(20, 'O ticker deve ter no maximo 20 caracteres.')
    .transform((ticker) => ticker.toUpperCase()),
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter no minimo 2 caracteres.')
    .max(150, 'O nome deve ter no maximo 150 caracteres.'),
  type: assetTypeSchema,
  currency: z
    .string()
    .trim()
    .min(3, 'A moeda deve ter no minimo 3 caracteres.')
    .max(10, 'A moeda deve ter no maximo 10 caracteres.')
    .transform((currency) => currency.toUpperCase()),
  exchange: z
    .string()
    .trim()
    .min(2, 'A bolsa deve ter no minimo 2 caracteres.')
    .max(80, 'A bolsa deve ter no maximo 80 caracteres.')
    .optional(),
  quantity: z.number().positive('A quantidade deve ser maior que zero.'),
  averagePrice: z.number().nonnegative('O preco medio nao pode ser negativo.'),
});

export const updateAssetSchema = createAssetSchema
  .omit({
    ticker: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  });

export const listAssetsQuerySchema = z.object({
  type: assetTypeSchema.optional(),
  currency: z
    .string()
    .trim()
    .transform((currency) => currency.toUpperCase())
    .optional(),
  exchange: z.string().trim().optional(),
});

export const assetTickerParamsSchema = z.object({
  ticker: z
    .string()
    .trim()
    .min(1, 'O ticker e obrigatorio.')
    .max(20, 'O ticker deve ter no maximo 20 caracteres.')
    .transform((ticker) => ticker.toUpperCase()),
});

export type CreateAssetSchema = z.infer<typeof createAssetSchema>;
export type UpdateAssetSchema = z.infer<typeof updateAssetSchema>;
export type ListAssetsQuerySchema = z.infer<typeof listAssetsQuerySchema>;
export type AssetTickerParamsSchema = z.infer<typeof assetTickerParamsSchema>;
