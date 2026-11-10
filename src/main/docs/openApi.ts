export const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'AssetTracker API',
    version: '2.0.0',
    description:
      'API para gerenciamento de ativos financeiros, investidores, carteiras e consulta externa de dados de mercado.',
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Ambiente local',
    },
  ],
  tags: [
    {
      name: 'Assets',
      description: 'Catalogo local de ativos financeiros.',
    },
    {
      name: 'Market',
      description: 'Consulta externa de ativos por ticker.',
    },
    {
      name: 'Investors',
      description: 'Cadastro de investidores e gerenciamento de carteira.',
    },
    {
      name: 'Auth',
      description: 'Login, renovacao de sessao e autorizacao por papel.',
    },
  ],
  paths: {
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autentica um investidor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Login' },
            },
          },
        },
        responses: {
          '200': {
            description:
              'Login concluido e refresh token salvo em cookie HttpOnly.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthenticationResponse' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Renova a sessao usando o refresh token em cookie',
        description:
          'Le o cookie HttpOnly refreshToken, gera um novo access token e substitui o cookie de refresh.',
        responses: {
          '200': {
            description: 'Sessao renovada.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthenticationResponse' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/assets': {
      get: {
        tags: ['Assets'],
        summary: 'Lista ativos financeiros do catalogo local',
        parameters: [
          {
            in: 'query',
            name: 'type',
            schema: { $ref: '#/components/schemas/AssetType' },
            required: false,
            description: 'Filtra ativos por tipo.',
          },
          {
            in: 'query',
            name: 'currency',
            schema: { type: 'string', example: 'USD' },
            required: false,
            description: 'Filtra ativos por moeda.',
          },
          {
            in: 'query',
            name: 'exchange',
            schema: { type: 'string', example: 'NASDAQ' },
            required: false,
            description: 'Filtra ativos por bolsa.',
          },
        ],
        responses: {
          '200': {
            description: 'Lista de ativos financeiros.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Asset' },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
      post: {
        tags: ['Assets'],
        summary: 'Cadastra um ativo financeiro manualmente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateAsset' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Ativo financeiro criado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Asset' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '409': { $ref: '#/components/responses/Conflict' },
        },
      },
    },
    '/api/v1/assets/{ticker}': {
      get: {
        tags: ['Assets'],
        summary: 'Busca ativo financeiro local por ticker',
        parameters: [{ $ref: '#/components/parameters/AssetTicker' }],
        responses: {
          '200': {
            description: 'Ativo financeiro encontrado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Asset' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Assets'],
        summary: 'Atualiza ativo financeiro local por ticker',
        parameters: [{ $ref: '#/components/parameters/AssetTicker' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateAsset' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Ativo financeiro atualizado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Asset' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Assets'],
        summary: 'Remove ativo financeiro local por ticker',
        parameters: [{ $ref: '#/components/parameters/AssetTicker' }],
        responses: {
          '204': {
            description: 'Ativo financeiro removido.',
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/v1/market/search': {
      get: {
        tags: ['Market'],
        summary: 'Consulta dados de mercado por ticker',
        description:
          'Consulta o provedor externo de mercado e retorna um DTO formatado. Se o provedor externo falhar, usa um fallback local para demonstracao.',
        parameters: [
          {
            in: 'query',
            name: 'ticker',
            required: true,
            schema: {
              type: 'string',
              example: 'AAPL',
            },
            description: 'Ticker do ativo financeiro.',
          },
        ],
        responses: {
          '200': {
            description: 'Dados de mercado encontrados.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MarketAsset' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '503': { $ref: '#/components/responses/ServiceUnavailable' },
        },
      },
    },
    '/api/v1/investors': {
      post: {
        tags: ['Investors'],
        summary: 'Cadastra um novo investidor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateInvestor' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Investidor criado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Investor' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '409': { $ref: '#/components/responses/Conflict' },
          '503': { $ref: '#/components/responses/ServiceUnavailable' },
        },
      },
    },
    '/api/v1/investors/{investorId}/holdings': {
      post: {
        tags: ['Investors'],
        summary: 'Adiciona um ativo a carteira do investidor',
        description:
          'Recebe o ticker e o ID do investidor, consulta o provedor de mercado se o ativo ainda nao existir no catalogo local e valida o limite de 6 ativos ativos na carteira.',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/InvestorId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddHolding' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Ativo adicionado a carteira.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Holding' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '409': { $ref: '#/components/responses/Conflict' },
          '503': { $ref: '#/components/responses/ServiceUnavailable' },
        },
      },
    },
    '/api/v1/investors/{investorId}/role': {
      patch: {
        tags: ['Investors'],
        summary: 'Altera o papel de um investidor',
        description: 'Requer um access token de administrador.',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/InvestorId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateInvestorRole' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Papel atualizado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Investor' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/v1/investors/{investorId}/portfolio': {
      get: {
        tags: ['Investors'],
        summary: 'Lista a carteira ativa do investidor',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/InvestorId' }],
        responses: {
          '200': {
            description: 'Carteira ativa do investidor.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Holding' },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '503': { $ref: '#/components/responses/ServiceUnavailable' },
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
      InvestorId: {
        in: 'path',
        name: 'investorId',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
          example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Dados de entrada invalidos.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
          },
        },
      },
      Conflict: {
        description: 'Conflito de regra de negocio ou registro duplicado.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      NotFound: {
        description: 'Recurso nao encontrado.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      ServiceUnavailable: {
        description: 'Banco de dados ou provedor externo indisponivel.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      Unauthorized: {
        description: 'Autenticacao obrigatoria ou token invalido.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      Forbidden: {
        description:
          'O usuario autenticado nao tem permissao para este recurso.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      AssetType: {
        type: 'string',
        enum: ['stock', 'etf', 'crypto', 'fund', 'reit'],
        example: 'etf',
      },
      Asset: {
        type: 'object',
        properties: {
          ticker: { type: 'string', example: 'MCHI' },
          name: { type: 'string', example: 'iShares MSCI China ETF' },
          type: { $ref: '#/components/schemas/AssetType' },
          currency: { type: 'string', example: 'USD' },
          exchange: { type: 'string', example: 'NASDAQ' },
          quantity: { type: 'number', example: 6 },
          averagePrice: { type: 'number', example: 45.2 },
        },
      },
      CreateAsset: {
        type: 'object',
        required: [
          'ticker',
          'name',
          'type',
          'currency',
          'quantity',
          'averagePrice',
        ],
        properties: {
          ticker: { type: 'string', example: 'MCHI' },
          name: { type: 'string', example: 'iShares MSCI China ETF' },
          type: { $ref: '#/components/schemas/AssetType' },
          currency: { type: 'string', example: 'USD' },
          exchange: { type: 'string', example: 'NASDAQ' },
          quantity: { type: 'number', example: 6 },
          averagePrice: { type: 'number', example: 45.2 },
        },
      },
      UpdateAsset: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Apple Inc.' },
          type: { $ref: '#/components/schemas/AssetType' },
          currency: { type: 'string', example: 'USD' },
          exchange: { type: 'string', example: 'NASDAQ' },
          quantity: { type: 'number', example: 12 },
          averagePrice: { type: 'number', example: 175.25 },
        },
      },
      MarketAsset: {
        type: 'object',
        properties: {
          ticker: { type: 'string', example: 'AAPL' },
          name: { type: 'string', example: 'Apple Inc.' },
          type: { $ref: '#/components/schemas/AssetType' },
          currency: { type: 'string', example: 'USD' },
          exchange: { type: 'string', example: 'NASDAQ' },
          price: { type: 'number', example: 180.5 },
          marketState: { type: 'string', example: 'REGULAR' },
        },
      },
      Investor: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          },
          name: { type: 'string', example: 'Samuel Detone' },
          email: { type: 'string', example: 'samuel.detone@email.com' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
        },
      },
      CreateInvestor: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Samuel Detone' },
          email: { type: 'string', example: 'samuel.detone@email.com' },
          password: {
            type: 'string',
            format: 'password',
            example: 'senha-segura',
          },
        },
      },
      Login: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'samuel.detone@email.com' },
          password: {
            type: 'string',
            format: 'password',
            example: 'senha-segura',
          },
        },
      },
      AuthenticationResponse: {
        type: 'object',
        properties: {
          investor: { $ref: '#/components/schemas/Investor' },
          accessToken: { type: 'string', description: 'JWT de curta duracao.' },
        },
      },
      UpdateInvestorRole: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'ADMIN' },
        },
      },
      AddHolding: {
        type: 'object',
        required: ['ticker', 'quantity'],
        properties: {
          ticker: { type: 'string', example: 'MCHI' },
          quantity: { type: 'number', example: 2 },
        },
      },
      Holding: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          },
          investorId: {
            type: 'string',
            format: 'uuid',
            example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          },
          assetTicker: { type: 'string', example: 'MCHI' },
          quantity: { type: 'number', example: 2 },
          active: { type: 'boolean', example: true },
          asset: { $ref: '#/components/schemas/Asset' },
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
      ValidationErrorResponse: {
        allOf: [{ $ref: '#/components/schemas/ErrorResponse' }],
        properties: {
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'ticker' },
                message: { type: 'string', example: 'O ticker e obrigatorio.' },
              },
            },
          },
        },
      },
    },
  },
};
