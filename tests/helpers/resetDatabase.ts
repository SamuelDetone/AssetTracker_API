import { prisma } from '@infrastructure/database/prisma/client.js';

export async function resetDatabase(): Promise<void> {
  await prisma.$transaction([
    prisma.invalidatedAccessToken.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.holding.deleteMany(),
    prisma.asset.deleteMany(),
    prisma.investor.deleteMany(),
  ]);
}
