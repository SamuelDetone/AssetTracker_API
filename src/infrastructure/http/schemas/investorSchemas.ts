import { z } from 'zod';

export const createInvestorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome deve ter no minimo 3 caracteres.')
    .max(150, 'O nome deve ter no maximo 150 caracteres.'),
  email: z
    .string()
    .trim()
    .email('Informe um e-mail valido.')
    .max(255, 'O e-mail deve ter no maximo 255 caracteres.')
    .transform((email) => email.toLowerCase()),
});

export const investorIdParamsSchema = z.object({
  investorId: z.string().uuid('O id do investidor deve ser um UUID valido.'),
});

export type CreateInvestorSchema = z.infer<typeof createInvestorSchema>;
export type InvestorIdParamsSchema = z.infer<typeof investorIdParamsSchema>;
