-- CreateEnum
CREATE TYPE "InvestorRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "investors"
ADD COLUMN "password" TEXT NOT NULL,
ADD COLUMN "role" "InvestorRole" NOT NULL DEFAULT 'USER';
