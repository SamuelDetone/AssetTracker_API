import {
  Asset,
  AssetType,
  CreateAssetInput,
  UpdateAssetInput,
} from '../../../domain/entities/Asset.js';
import {
  IAssetRepository,
  ListAssetFilters,
} from '../../../domain/repositories/IAssetRepository.js';
import { postgresPool } from './connection.js';

type AssetRow = {
  ticker: string;
  name: string;
  type: AssetType;
  currency: string;
  exchange: string | null;
  quantity: string;
  average_price: string;
};

export class PgAssetRepository implements IAssetRepository {
  async list(filters?: ListAssetFilters): Promise<Asset[]> {
    const conditions: string[] = [];
    const values: string[] = [];

    if (filters?.type) {
      values.push(filters.type);
      conditions.push(`type = $${values.length}`);
    }

    if (filters?.currency) {
      values.push(filters.currency);
      conditions.push(`currency = $${values.length}`);
    }

    if (filters?.exchange) {
      values.push(filters.exchange);
      conditions.push(`exchange = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await postgresPool.query<AssetRow>(
      `SELECT ticker, name, type, currency, exchange, quantity, average_price
       FROM assets
       ${whereClause}
       ORDER BY ticker`,
      values,
    );

    return result.rows.map(this.mapRowToAsset);
  }

  async findByTicker(ticker: string): Promise<Asset | null> {
    const result = await postgresPool.query<AssetRow>(
      `SELECT ticker, name, type, currency, exchange, quantity, average_price
       FROM assets
       WHERE LOWER(ticker) = LOWER($1)
       LIMIT 1`,
      [ticker],
    );

    const asset = result.rows[0];

    return asset ? this.mapRowToAsset(asset) : null;
  }

  async create(data: CreateAssetInput): Promise<Asset> {
    const result = await postgresPool.query<AssetRow>(
      `INSERT INTO assets (ticker, name, type, currency, exchange, quantity, average_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ticker, name, type, currency, exchange, quantity, average_price`,
      [
        data.ticker.toUpperCase(),
        data.name,
        data.type,
        data.currency,
        data.exchange ?? null,
        data.quantity,
        data.averagePrice,
      ],
    );

    return this.mapRowToAsset(result.rows[0]);
  }

  async update(ticker: string, data: UpdateAssetInput): Promise<Asset | null> {
    const currentAsset = await this.findByTicker(ticker);

    if (!currentAsset) {
      return null;
    }

    const updatedAsset = {
      ...currentAsset,
      ...data,
    };

    const result = await postgresPool.query<AssetRow>(
      `UPDATE assets
       SET name = $2,
           type = $3,
           currency = $4,
           exchange = $5,
           quantity = $6,
           average_price = $7
       WHERE LOWER(ticker) = LOWER($1)
       RETURNING ticker, name, type, currency, exchange, quantity, average_price`,
      [
        ticker,
        updatedAsset.name,
        updatedAsset.type,
        updatedAsset.currency,
        updatedAsset.exchange ?? null,
        updatedAsset.quantity,
        updatedAsset.averagePrice,
      ],
    );

    const asset = result.rows[0];

    return asset ? this.mapRowToAsset(asset) : null;
  }

  async delete(ticker: string): Promise<boolean> {
    const result = await postgresPool.query(
      'DELETE FROM assets WHERE LOWER(ticker) = LOWER($1)',
      [ticker],
    );

    return (result.rowCount ?? 0) > 0;
  }

  private mapRowToAsset(row: AssetRow): Asset {
    return {
      ticker: row.ticker,
      name: row.name,
      type: row.type,
      currency: row.currency,
      exchange: row.exchange ?? undefined,
      quantity: Number(row.quantity),
      averagePrice: Number(row.average_price),
    };
  }
}
