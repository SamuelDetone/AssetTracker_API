import request from 'supertest';

import { app } from '@main/app.js';
import { prisma } from '@infrastructure/database/prisma/client.js';
import { resetRateLimiters } from '@infrastructure/http/middlewares/rateLimiters.js';
import { resetDatabase } from '@tests/helpers/resetDatabase.js';

describe('blindagem HTTP da API', () => {
  beforeEach(async () => {
    await resetDatabase();
    await resetRateLimiters();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('remove conteudo XSS antes de persistir o investidor', async () => {
    const response = await request(app).post('/api/v1/investors').send({
      name: 'Samuel <script>alert("xss")</script>',
      email: 'samuel@example.com',
      password: 'senha-segura',
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Samuel');
    expect(response.body.name).not.toContain('<script>');
  });

  it('retorna erro Zod estruturado para payload invalido', async () => {
    const response = await request(app).post('/api/v1/investors').send({
      name: 'Sa',
      email: 'email-invalido',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'error',
        statusCode: 400,
        details: expect.any(Array),
      }),
    );
  });

  it('bloqueia investidor USER em rota exclusiva de administrador', async () => {
    const createResponse = await request(app).post('/api/v1/investors').send({
      name: 'Samuel Detone',
      email: 'samuel@example.com',
      password: 'senha-segura',
    });
    const investorId = createResponse.body.id as string;

    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'samuel@example.com',
      password: 'senha-segura',
    });

    const response = await request(app)
      .patch(`/api/v1/investors/${investorId}/role`)
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .send({ role: 'ADMIN' });

    expect(response.status).toBe(403);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'error',
        statusCode: 403,
      }),
    );
  });

  it('bloqueia a sexta tentativa de login com status 429', async () => {
    const credentials = {
      email: 'naoexiste@example.com',
      password: 'senha-invalida',
    };

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await request(app).post('/api/v1/auth/login').send(credentials).expect(401);
    }

    const blockedResponse = await request(app).post('/api/v1/auth/login').send(credentials);

    expect(blockedResponse.status).toBe(429);
    expect(blockedResponse.body).toEqual(
      expect.objectContaining({
        status: 'error',
        statusCode: 429,
      }),
    );
  });
});
