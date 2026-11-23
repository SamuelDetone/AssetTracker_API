import request from 'supertest';

import { app } from '@main/app.js';
import { prisma } from '@infrastructure/database/prisma/client.js';

describe('consulta de mercado sem dependencia externa', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('retorna um ativo do catalogo de mercado offline', async () => {
    const response = await request(app).get('/api/v1/market/search?ticker=mchi').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        ticker: 'MCHI',
        name: 'iShares MSCI China ETF',
        type: 'etf',
        currency: 'USD',
      }),
    );
  });

  it('retorna 404 para ticker ausente do catalogo offline', async () => {
    const response = await request(app).get('/api/v1/market/search?ticker=UNKNOWN').expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'error',
        statusCode: 404,
      }),
    );
  });
});
