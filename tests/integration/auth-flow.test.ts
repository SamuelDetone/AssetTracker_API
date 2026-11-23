import request from 'supertest';

import { app } from '@main/app.js';
import { prisma } from '@infrastructure/database/prisma/client.js';
import { resetDatabase } from '@tests/helpers/resetDatabase.js';

describe('fluxo de autenticacao HTTP', () => {
  const investor = {
    name: 'Samuel Detone',
    email: 'samuel@example.com',
    password: 'senha-segura',
  };

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('cadastra, autentica, renova, encerra e bloqueia uma sessao', async () => {
    const createResponse = await request(app).post('/api/v1/investors').send(investor).expect(201);

    expect(createResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: investor.name,
        email: investor.email,
        role: 'USER',
      }),
    );
    expect(createResponse.body).not.toHaveProperty('password');

    const agent = request.agent(app);
    const loginResponse = await agent
      .post('/api/v1/auth/login')
      .send({ email: investor.email, password: investor.password })
      .expect(200);

    const originalAccessToken = loginResponse.body.accessToken as string;
    const originalRefreshCookie = loginResponse.headers['set-cookie'];

    expect(originalAccessToken).toEqual(expect.any(String));
    expect(originalRefreshCookie).toBeDefined();

    const profileResponse = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${originalAccessToken}`)
      .expect(200);

    expect(profileResponse.body.investor).toEqual(
      expect.objectContaining({
        id: createResponse.body.id,
        email: investor.email,
      }),
    );
    expect(profileResponse.body.investor).not.toHaveProperty('password');

    const refreshResponse = await agent.post('/api/v1/auth/refresh-token').expect(200);

    expect(refreshResponse.body.accessToken).toEqual(expect.any(String));
    expect(refreshResponse.body.accessToken).not.toBe(originalAccessToken);

    if (!originalRefreshCookie) {
      throw new Error('Cookie de refresh token nao recebido no login.');
    }

    await request(app)
      .post('/api/v1/auth/refresh-token')
      .set('Cookie', originalRefreshCookie)
      .expect(401);

    await agent
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${originalAccessToken}`)
      .expect(204);

    await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${originalAccessToken}`)
      .expect(401);
  });
});
