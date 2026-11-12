# AssetTracker API

API REST desenvolvida em Node.js, TypeScript e Express para gerenciamento de ativos financeiros, investidores e carteiras. O projeto evolui ao longo das entregas da disciplina, aplicando Clean Architecture, persistencia relacional, autenticacao JWT e integracao com dados de mercado.

A aplicacao usa PostgreSQL com Prisma para os dados persistentes. A consulta de mercado fica atras de uma interface de gateway, permitindo trocar o provedor externo no futuro sem alterar as regras de negocio.

## Tecnologias

- Node.js 20+
- TypeScript em modo strict
- Express
- Swagger UI
- ESLint
- Prettier
- Docker
- PostgreSQL
- Adminer

## Arquitetura

O projeto segue uma organização inspirada em Clean Architecture:

```txt
src/
├── domain/
│   ├── entities/
│   ├── errors/
│   └── repositories/
├── application/
│   └── use-cases/
├── infrastructure/
│   ├── database/
│   └── http/
└── main/
    ├── docs/
    ├── factories/
    └── server.ts
```

### Domain

Contém o núcleo da aplicação:

- entidade `Asset`
- contrato `IAssetRepository`
- erro customizado `AppError`

Essa camada não depende do Express nem de detalhes externos.

### Application

Contém os casos de uso:

- `ListAssetsUseCase`
- `GetAssetByTickerUseCase`
- `CreateAssetUseCase`
- `UpdateAssetUseCase`
- `DeleteAssetUseCase`

Os casos de uso representam as ações que o sistema executa.

### Infrastructure

Contém detalhes técnicos:

- `InMemoryAssetRepository`
- `AssetController`
- `assetRoutes`
- `errorHandler`

Nesta entrega, o repositório em memória simula uma fonte de dados local.

### Main

Responsável por montar a aplicação:

- cria as dependências na factory
- registra rotas no Express
- registra Swagger
- registra o tratamento global de erros

## Dados Iniciais

Ao iniciar o servidor, a API começa com estes ativos cadastrados:

```txt
AAPL     - Apple Inc.
PETR4.SA - Petrobras PN
BTC-USD  - Bitcoin
MCHI     - iShares MSCI China ETF
```

## Instalação

Instale as dependências:

```bash
npm install
```

## Execução

Para rodar em desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3333
```

A documentação interativa ficará disponível em:

```txt
http://localhost:3333/api/docs
```

## Execução Com Docker

Crie um arquivo `.env` a partir do exemplo:

```bash
copy .env.example .env
```

Depois suba os containers:

```bash
docker compose up -d
```

Esse comando inicia:

- API em `http://localhost:3333`
- PostgreSQL na porta definida por `POSTGRES_PORT` (por padrao, `5433`)
- Adminer em `http://localhost:8080`

Para verificar se os containers estão rodando:

```bash
docker compose ps
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

Para acessar o terminal do container da API:

```bash
docker compose exec app sh
```

Para parar os containers:

```bash
docker compose down
```

Para parar e apagar também o volume do banco:

```bash
docker compose down -v
```

### Acesso Ao Adminer

Abra:

```txt
http://localhost:8080
```

Use os dados:

```txt
Sistema: PostgreSQL
Servidor: postgres
Usuario: assettracker
Senha: assettracker
Base de dados: assettracker_db
```

No primeiro momento, o banco ainda pode estar sem tabelas. As tabelas entram na próxima etapa, quando configurarmos Prisma e migrations.

## Banco Relacional Inicial

A pasta `database/` possui scripts SQL para criar a estrutura inicial do banco pelo Adminer ou por outro cliente PostgreSQL.

Arquivos:

```txt
database/schema.sql
database/seed.sql
```

Para executar pelo Adminer:

1. Suba os containers com `docker compose up -d`.
2. Abra `http://localhost:8080`.
3. Acesse o banco `assettracker_db`.
4. Abra a opção de comando SQL.
5. Execute o conteúdo de `database/schema.sql`.
6. Execute o conteúdo de `database/seed.sql`.

Tabelas criadas:

```txt
investors - investidores cadastrados
assets    - ativos financeiros disponíveis
holdings  - ativos associados à carteira de um investidor
```

Consultas úteis para verificar:

```sql
SELECT * FROM investors;
SELECT * FROM assets;
SELECT * FROM holdings;
```

Nesta etapa, o projeto também possui repositórios PostgreSQL com consultas parametrizadas:

```txt
src/infrastructure/database/postgres/connection.ts
src/infrastructure/database/postgres/PgAssetRepository.ts
src/infrastructure/database/postgres/PgInvestorRepository.ts
```

O `PgAssetRepository` substitui o repositório em memória na factory da API. Por isso, antes de testar os endpoints de ativos com Docker, execute `database/schema.sql` e `database/seed.sql` no banco.

## Prisma

O projeto possui configuração inicial do Prisma em:

```txt
prisma/schema.prisma
prisma/migrations/
```

Comandos úteis:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:studio
```

O Prisma Studio abre em:

```txt
http://localhost:5555
```

Se o banco já tiver sido criado manualmente pelos scripts SQL da Aula 8, use esta etapa para comparar o modelo Prisma com as tabelas existentes. Nas próximas aulas, os repositórios passam a usar o Prisma Client.

Repositórios Prisma:

```txt
src/infrastructure/database/prisma/client.ts
src/infrastructure/database/prisma/PrismaAssetRepository.ts
src/infrastructure/database/prisma/PrismaInvestorRepository.ts
```

Atualmente a factory da API usa o `PrismaAssetRepository`, mantendo o contrato `IAssetRepository` da camada de domínio.

Erros conhecidos do Prisma são convertidos para respostas HTTP pelo mapper:

```txt
src/infrastructure/database/prisma/prismaErrorMapper.ts
```

Exemplos:

```txt
P2002 -> 409 Conflict para registro duplicado
P2003 -> 400 Bad Request para relacionamento inválido
P2025 -> 404 Not Found para registro inexistente
```

## Validação Com Zod

Os schemas de validação ficam em:

```txt
src/infrastructure/http/schemas/assetSchemas.ts
src/infrastructure/http/schemas/investorSchemas.ts
```

Eles definem regras para validar payloads, params e queries antes dos dados chegarem aos casos de uso. As rotas aplicam esses schemas por meio de um middleware de validacao.

O middleware responsável por aplicar os schemas nas rotas é:

```txt
src/infrastructure/http/middlewares/validateRequest.ts
```

Quando o Zod encontra dados inválidos, o `errorHandler` retorna status `400 Bad Request` com os campos e mensagens de erro.

## Seguranca e Configuracao

As configuracoes de ambiente sao validadas pelo Zod assim que a aplicacao inicia. Se uma variavel obrigatoria estiver ausente ou invalida, o servidor nao inicia com uma configuracao insegura.

Crie o arquivo local de configuracao a partir do modelo:

```bash
copy .env.example .env
```

As variaveis mais importantes sao:

```txt
DATABASE_URL          Conexao com o PostgreSQL
FRONTEND_URL          Origem permitida pelo CORS
JWT_ACCESS_SECRET     Chave do token de acesso (minimo de 32 caracteres)
JWT_REFRESH_SECRET    Chave do refresh token (minimo de 32 caracteres)
USE_EXTERNAL_MARKET_API Habilita ou desabilita a consulta externa de mercado
```

O arquivo `.env` contem dados locais e chaves secretas, por isso nao deve ser enviado ao Git. Use apenas o `.env.example` como modelo.

Protecoes implementadas:

- `helmet` adiciona headers HTTP defensivos e oculta o `X-Powered-By`.
- CORS aceita somente a origem definida em `FRONTEND_URL` para requisicoes feitas por navegadores.
- O limite geral e de 100 requisicoes por IP a cada 15 minutos. As rotas de autenticacao aceitam 5 tentativas a cada 5 minutos.
- JSON e formularios tem limite de 10kb. Campos de texto e chaves suspeitas sao higienizados antes da validacao.
- Rotas de carteira exigem access token JWT no cabecalho `Authorization: Bearer <token>`; o refresh token e mantido em cookie `HttpOnly`.

No Swagger, use o botao **Authorize** para informar o access token nas rotas protegidas. A documentacao tambem descreve as respostas `401`, `403`, `413` e `429`.

### Testes Manuais de Seguranca

Com a API em execucao (`npm run dev`), estes comandos podem ser usados no PowerShell:

Verificar headers de seguranca:

```powershell
(Invoke-WebRequest -Uri http://localhost:3333/api/docs -Method Head).Headers
```

Confirmar que um payload acima de 10kb retorna `413`:

```powershell
$body = @{
  ticker = 'LONG'
  name = 'A' * 11000
  type = 'stock'
  currency = 'USD'
  exchange = 'TEST'
  quantity = 1
  averagePrice = 1
} | ConvertTo-Json

try {
  Invoke-WebRequest -Uri http://localhost:3333/api/v1/assets -Method Post -ContentType 'application/json' -Body $body
} catch {
  $_.ErrorDetails.Message
}
```

Confirmar o limite de tentativas de autenticacao. Reinicie a API antes deste teste para limpar o contador local; a sexta tentativa deve retornar `429`:

```powershell
$login = @{ email = 'naoexiste@example.com'; password = 'senha-invalida' } | ConvertTo-Json
1..6 | ForEach-Object {
  try {
    (Invoke-WebRequest -Uri http://localhost:3333/api/v1/auth/login -Method Post -ContentType 'application/json' -Body $login).StatusCode
  } catch {
    [int]$_.Exception.Response.StatusCode
  }
}
```

## Scripts

```bash
npm run dev
```

Inicia a API em modo desenvolvimento.

```bash
npm run build
```

Compila o projeto TypeScript.

```bash
npm run lint
```

Verifica padrões de código com ESLint e Prettier.

```bash
npm run prisma:generate
```

Gera o Prisma Client.

```bash
npm run prisma:migrate -- --name init
```

Executa migrations do Prisma no PostgreSQL.

```bash
npm run prisma:studio
```

Abre a interface visual do Prisma Studio.

```bash
docker compose up -d
```

Sobe API, PostgreSQL e Adminer em containers.

```bash
docker compose down
```

Para e remove os containers.

## Endpoints

### Listar ativos

```http
GET /api/v1/assets
```

Resposta esperada:

```json
[
  {
    "ticker": "AAPL",
    "name": "Apple Inc.",
    "type": "stock",
    "currency": "USD",
    "exchange": "NASDAQ",
    "quantity": 10,
    "averagePrice": 180.5
  }
]
```

### Filtrar ativos

```http
GET /api/v1/assets?type=etf
GET /api/v1/assets?currency=BRL
GET /api/v1/assets?exchange=NASDAQ
```

Os filtros usam `req.query`.

### Buscar ativo por ticker

```http
GET /api/v1/assets/AAPL
```

O ticker usa `req.params`.

### Criar ativo

```http
POST /api/v1/assets
```

Corpo da requisição:

```json
{
  "ticker": "MSFT",
  "name": "Microsoft Corporation",
  "type": "stock",
  "currency": "USD",
  "exchange": "NASDAQ",
  "quantity": 5,
  "averagePrice": 320.25
}
```

Resposta esperada:

```json
{
  "ticker": "MSFT",
  "name": "Microsoft Corporation",
  "type": "stock",
  "currency": "USD",
  "exchange": "NASDAQ",
  "quantity": 5,
  "averagePrice": 320.25
}
```

O corpo usa `req.body`.

### Atualizar ativo

```http
PUT /api/v1/assets/MSFT
```

Corpo da requisição:

```json
{
  "quantity": 8,
  "averagePrice": 315.1
}
```

### Remover ativo

```http
DELETE /api/v1/assets/MSFT
```

Resposta esperada:

```txt
204 No Content
```

### Criar investidor

```http
POST /api/v1/investors
```

Corpo da requisição:

```json
{
  "name": "Samuel Detone",
  "email": "samuel@example.com",
  "password": "uma-senha-com-pelo-menos-8-caracteres"
}
```

### Adicionar ativo na carteira

```http
POST /api/v1/investors/:investorId/holdings
```

Corpo da requisição:

```json
{
  "ticker": "AAPL",
  "quantity": 2
}
```

Regra de negócio:

```txt
Um investidor pode ter no maximo 6 ativos ativos na carteira.
```

Se o ticker informado ainda não existir no banco, a aplicação consulta o gateway de mercado, cria o ativo localmente com os dados formatados e então adiciona a posição na carteira.

### Listar carteira do investidor

```http
GET /api/v1/investors/:investorId/portfolio
```

### Buscar ativo em provedor externo

```http
GET /api/v1/market/search?ticker=AAPL
```

Esse endpoint consulta o gateway de dados de mercado e retorna um DTO formatado com dados do ativo.

Se `USE_EXTERNAL_MARKET_API=false`, a aplicação usa um gateway em memória para rodar sem internet.

## Tratamento de Erros

A API possui tratamento global de erros com `AppError`, `errorHandler` e tratamento de falhas conhecidas do Prisma.

Os erros de autenticacao e seguranca tambem possuem respostas padronizadas:

```txt
401 - Token ausente, invalido ou expirado
403 - Usuario sem permissao para o recurso
413 - Corpo da requisicao maior que 10kb
429 - Limite de requisicoes atingido
```

Exemplo de erro para ativo inexistente:

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Asset not found."
}
```

Exemplo de erro para ativo duplicado:

```json
{
  "status": "error",
  "statusCode": 409,
  "message": "Asset already exists."
}
```

## Observação Sobre yfinance

O yfinance pode ser usado em uma etapa futura para buscar cotações e dados históricos de ativos. Como yfinance é uma biblioteca Python, uma integração futura pode ser feita por meio de um serviço Python separado ou por um script chamado pela API Node.js.

Nesta entrega, a API possui um gateway externo HTTP para busca simples de tickers e um gateway em memória para fallback/offline. A integração com yfinance pode substituir essa implementação no futuro sem alterar a camada de domínio.

## Status da Entrega 1

Requisitos atendidos:

- Clean Architecture com camadas separadas
- TypeScript em modo strict
- Path aliases configurados no `tsconfig.json`
- ESLint e Prettier integrados
- Interface `IAssetRepository` na camada de domínio
- Implementação `InMemoryAssetRepository`
- CRUD REST completo para ativos financeiros
- Uso de `req.query`, `req.params` e `req.body`
- Swagger/OpenAPI em `/api/docs`
- Tratamento global de erros
