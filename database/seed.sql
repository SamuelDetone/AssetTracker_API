INSERT INTO assets (ticker, name, type, currency, exchange, quantity, average_price)
VALUES
  ('AAPL', 'Apple Inc.', 'stock', 'USD', 'NASDAQ', 10, 180.50),
  ('PETR4.SA', 'Petrobras PN', 'stock', 'BRL', 'B3', 20, 35.75),
  ('BTC-USD', 'Bitcoin', 'crypto', 'USD', 'Yahoo Finance', 0.05, 65000.00),
  ('MCHI', 'iShares MSCI China ETF', 'etf', 'USD', 'NASDAQ', 6, 45.20)
ON CONFLICT (ticker) DO NOTHING;
