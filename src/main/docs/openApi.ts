export const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'AssetTracker API',
    version: '1.0.0',
    description:
      'API para gerenciamento local de ativos financeiros da Entrega 1.',
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Ambiente local',
    },
  ],
  paths: {
    '/api/v1/assets': {
      get: {
        summary: 'Lista ativos financeiros do catalogo local',
        parameters: [
          {
            in: 'query',
            name: 'type',
            schema: { type: 'string' },
            required: false,
            description: 'Filtra ativos por tipo, como stock, etf ou crypto.',
          },
          {
            in: 'query',
            name: 'currency',
            schema: { type: 'string' },
            required: false,
            description: 'Filtra ativos por moeda, como BRL ou USD.',
          },
          {
            in: 'query',
            name: 'exchange',
            schema: { type: 'string' },
            required: false,
            description: 'Filtra ativos por bolsa, como B3 ou NASDAQ.',
          },
        ],
        responses: {
          '200': {
            description: 'Lista de ativos financeiros.',
          },
        },
      },
      post: {
        summary: 'Cadastra um ativo financeiro manualmente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateAsset',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Ativo financeiro criado.',
          },
          '409': {
            description: 'Ativo financeiro ja cadastrado.',
          },
        },
      },
    },
    '/api/v1/assets/{ticker}': {
      get: {
        summary: 'Busca ativo financeiro local por ticker',
        parameters: [{ $ref: '#/components/parameters/AssetTicker' }],
        responses: {
          '200': {
            description: 'Ativo financeiro encontrado.',
          },
          '404': {
            description: 'Ativo financeiro nao encontrado.',
          },
        },
      },
      put: {
        summary: 'Atualiza ativo financeiro local por ticker',
        parameters: [{ $ref: '#/components/parameters/AssetTicker' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateAsset',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Ativo financeiro atualizado.',
          },
          '404': {
            description: 'Ativo financeiro nao encontrado.',
          },
        },
      },
      delete: {
        summary: 'Remove ativo financeiro local por ticker',
        parameters: [{ $ref: '#/components/parameters/AssetTicker' }],
        responses: {
          '204': {
            description: 'Ativo financeiro removido.',
          },
          '404': {
            description: 'Ativo financeiro nao encontrado.',
          },
        },
      },
    },
  },
  components: {
    parameters: {
      AssetTicker: {
        in: 'path',
        name: 'ticker',
        required: true,
        schema: {
          type: 'string',
          example: 'AAPL',
        },
      },
    },
    schemas: {
      Asset: {
        type: 'object',
        properties: {
          ticker: { type: 'string', example: 'AAPL' },
          name: { type: 'string', example: 'Apple Inc.' },
          type: { type: 'string', example: 'stock' },
          currency: { type: 'string', example: 'USD' },
          exchange: { type: 'string', example: 'NASDAQ' },
          quantity: { type: 'number', example: 10 },
          averagePrice: { type: 'number', example: 180.5 },
        },
      },
      CreateAsset: {
        allOf: [{ $ref: '#/components/schemas/Asset' }],
      },
      UpdateAsset: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Apple Inc.' },
          type: { type: 'string', example: 'stock' },
          currency: { type: 'string', example: 'USD' },
          exchange: { type: 'string', example: 'NASDAQ' },
          quantity: { type: 'number', example: 12 },
          averagePrice: { type: 'number', example: 175.25 },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Asset not found.' },
        },
      },
    },
  },
};
