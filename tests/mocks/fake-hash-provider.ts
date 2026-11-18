import { IHashProvider } from '@domain/providers/IHashProvider.js';

export class FakeHashProvider implements IHashProvider {
  async hash(value: string): Promise<string> {
    return `hashed:${value}`;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return hash === `hashed:${value}`;
  }
}
