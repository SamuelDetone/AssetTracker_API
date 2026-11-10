import { InvestorRole } from '../../domain/entities/Investor.js';

declare global {
  namespace Express {
    interface Request {
      cookies: Record<string, string | undefined>;
      user?: {
        id: string;
        role: InvestorRole;
      };
    }
  }
}

export {};
