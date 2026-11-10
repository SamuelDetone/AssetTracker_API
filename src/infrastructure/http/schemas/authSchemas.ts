import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Informe um e-mail valido.')
    .max(255, 'O e-mail deve ter no maximo 255 caracteres.')
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, 'A senha e obrigatoria.'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
