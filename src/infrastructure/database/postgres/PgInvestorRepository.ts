import {
  CreateInvestorInput,
  Investor,
} from '../../../domain/entities/Investor.js';
import { IInvestorRepository } from '../../../domain/repositories/IInvestorRepository.js';
import { postgresPool } from './connection.js';

type InvestorRow = {
  id: string;
  name: string;
  email: string;
};

export class PgInvestorRepository implements IInvestorRepository {
  async create(data: CreateInvestorInput): Promise<Investor> {
    const result = await postgresPool.query<InvestorRow>(
      `INSERT INTO investors (id, name, email)
       VALUES (COALESCE($1, gen_random_uuid()), $2, $3)
       RETURNING id, name, email`,
      [data.id ?? null, data.name, data.email.toLowerCase()],
    );

    return result.rows[0];
  }

  async findById(id: string): Promise<Investor | null> {
    const result = await postgresPool.query<InvestorRow>(
      'SELECT id, name, email FROM investors WHERE id = $1 LIMIT 1',
      [id],
    );

    return result.rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<Investor | null> {
    const result = await postgresPool.query<InvestorRow>(
      'SELECT id, name, email FROM investors WHERE email = $1 LIMIT 1',
      [email.toLowerCase()],
    );

    return result.rows[0] ?? null;
  }
}
