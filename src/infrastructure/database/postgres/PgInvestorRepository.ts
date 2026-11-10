import {
  CreateInvestorInput,
  Investor,
  InvestorRole,
} from '../../../domain/entities/Investor.js';
import { IInvestorRepository } from '../../../domain/repositories/IInvestorRepository.js';
import { postgresPool } from './connection.js';

type InvestorRow = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: InvestorRole;
};

export class PgInvestorRepository implements IInvestorRepository {
  async create(data: CreateInvestorInput): Promise<Investor> {
    const result = await postgresPool.query<InvestorRow>(
      `INSERT INTO investors (id, name, email, password, role)
       VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, 'USER')
       RETURNING id, name, email, password, role`,
      [data.id ?? null, data.name, data.email.toLowerCase(), data.password],
    );

    return result.rows[0];
  }

  async findById(id: string): Promise<Investor | null> {
    const result = await postgresPool.query<InvestorRow>(
      'SELECT id, name, email, password, role FROM investors WHERE id = $1 LIMIT 1',
      [id],
    );

    return result.rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<Investor | null> {
    const result = await postgresPool.query<InvestorRow>(
      'SELECT id, name, email, password, role FROM investors WHERE email = $1 LIMIT 1',
      [email.toLowerCase()],
    );

    return result.rows[0] ?? null;
  }

  async updateRole(id: string, role: InvestorRole): Promise<Investor | null> {
    const result = await postgresPool.query<InvestorRow>(
      `UPDATE investors
       SET role = $2
       WHERE id = $1
       RETURNING id, name, email, password, role`,
      [id, role],
    );

    return result.rows[0] ?? null;
  }
}
