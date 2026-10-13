-- DropForeignKey
ALTER TABLE "holdings" DROP CONSTRAINT "holdings_asset_ticker_fkey";

-- DropForeignKey
ALTER TABLE "holdings" DROP CONSTRAINT "holdings_investor_id_fkey";

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_asset_ticker_fkey" FOREIGN KEY ("asset_ticker") REFERENCES "assets"("ticker") ON DELETE RESTRICT ON UPDATE CASCADE;
