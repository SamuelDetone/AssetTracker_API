import bcrypt from 'bcryptjs';

import { IHashProvider } from '../../domain/providers/IHashProvider.js';

export class BcryptHashProvider implements IHashProvider {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
