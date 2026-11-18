-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_hash" TEXT NOT NULL,
    "investor_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(6) WITH TIME ZONE NOT NULL,
    "created_at" TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invalidated_access_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_hash" TEXT NOT NULL,
    "investor_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(6) WITH TIME ZONE NOT NULL,
    "created_at" TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invalidated_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_investor_id" ON "refresh_tokens"("investor_id");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_expires_at" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "invalidated_access_tokens_token_hash_key" ON "invalidated_access_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "idx_invalidated_access_tokens_investor_id" ON "invalidated_access_tokens"("investor_id");

-- CreateIndex
CREATE INDEX "idx_invalidated_access_tokens_expires_at" ON "invalidated_access_tokens"("expires_at");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_investor_id_fkey"
FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invalidated_access_tokens" ADD CONSTRAINT "invalidated_access_tokens_investor_id_fkey"
FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
