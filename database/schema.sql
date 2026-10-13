CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assets (
  ticker VARCHAR(20) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('stock', 'etf', 'crypto', 'fund', 'reit')),
  currency VARCHAR(10) NOT NULL,
  exchange VARCHAR(80),
  quantity NUMERIC(14, 6) NOT NULL DEFAULT 0,
  average_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  asset_ticker VARCHAR(20) NOT NULL REFERENCES assets(ticker) ON DELETE RESTRICT,
  quantity NUMERIC(14, 6) NOT NULL CHECK (quantity > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (investor_id, asset_ticker)
);

CREATE INDEX IF NOT EXISTS idx_holdings_investor_id ON holdings(investor_id);
CREATE INDEX IF NOT EXISTS idx_assets_name ON assets(name);
