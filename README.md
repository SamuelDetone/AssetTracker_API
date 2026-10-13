# AssetTracker API

API REST desenvolvida em Node.js, TypeScript e Express para gerenciamento local de ativos financeiros. O projeto foi criado para a Entrega 1 da disciplina, com foco em Clean Architecture, repositório em memória, contrato REST e documentação interativa com Swagger/OpenAPI.

Nesta primeira etapa, os dados ficam em memória enquanto a aplicação está rodando. A estrutura foi pensada para permitir evolução futura com banco de dados, autenticação e integração externa para cotações, como yfinance.

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
- PostgreSQL na porta `5432`
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

## Tratamento de Erros

A API possui tratamento global de erros com `AppError` e `errorHandler`.

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

Nesta entrega, a API ainda não consome dados online. Ela apenas deixa o domínio preparado para essa evolução.

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
