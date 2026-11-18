import { AddHoldingToPortfolioUseCase } from '@application/use-cases/AddHoldingToPortfolioUseCase.js';
import { ListInvestorPortfolioUseCase } from '@application/use-cases/ListInvestorPortfolioUseCase.js';
import { SearchMarketAssetUseCase } from '@application/use-cases/SearchMarketAssetUseCase.js';
import { InMemoryAssetRepository } from '@tests/mocks/in-memory-asset-repository.js';
import { InMemoryHoldingRepository } from '@tests/mocks/in-memory-holding-repository.js';
import { InMemoryInvestorRepository } from '@tests/mocks/in-memory-investor-repository.js';
import { FakeMarketDataGateway } from '@tests/mocks/fake-market-data-gateway.js';

describe('casos de uso de carteira e mercado', () => {
  let investorRepository: InMemoryInvestorRepository;
  let assetRepository: InMemoryAssetRepository;
  let holdingRepository: InMemoryHoldingRepository;
  let marketDataGateway: FakeMarketDataGateway;
  const investorId = 'investor-id';

  beforeEach(async () => {
    investorRepository = new InMemoryInvestorRepository();
    assetRepository = new InMemoryAssetRepository();
    holdingRepository = new InMemoryHoldingRepository();
    marketDataGateway = new FakeMarketDataGateway();

    await investorRepository.create({
      id: investorId,
      name: 'Samuel Detone',
      email: 'samuel@example.com',
      password: 'hashed:senha-segura',
    });
  });

  it('adiciona um ativo local a carteira', async () => {
    await assetRepository.create({
      ticker: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      currency: 'USD',
      exchange: 'NASDAQ',
      quantity: 0,
      averagePrice: 180,
    });

    const sut = new AddHoldingToPortfolioUseCase(
      investorRepository,
      assetRepository,
      holdingRepository,
      marketDataGateway,
    );

    await expect(
      sut.execute({ investorId, ticker: 'AAPL', quantity: 2 }),
    ).resolves.toEqual(
      expect.objectContaining({ investorId, assetTicker: 'AAPL', quantity: 2 }),
    );
  });

  it('consulta o mercado e cria o ativo local quando necessario', async () => {
    marketDataGateway.assets.set('MCHI', {
      ticker: 'MCHI',
      name: 'China ETF',
      type: 'etf',
      currency: 'USD',
      exchange: 'NASDAQ',
      price: 45.2,
    });
    const sut = new AddHoldingToPortfolioUseCase(
      investorRepository,
      assetRepository,
      holdingRepository,
      marketDataGateway,
    );

    await sut.execute({ investorId, ticker: 'MCHI', quantity: 1 });

    await expect(assetRepository.findByTicker('MCHI')).resolves.toEqual(
      expect.objectContaining({ averagePrice: 45.2 }),
    );
  });

  it('rejeita investidor inexistente, ativo externo ausente e carteira cheia', async () => {
    const sut = new AddHoldingToPortfolioUseCase(
      investorRepository,
      assetRepository,
      holdingRepository,
      marketDataGateway,
    );

    await expect(
      sut.execute({ investorId: 'missing', ticker: 'AAPL', quantity: 1 }),
    ).rejects.toMatchObject({ statusCode: 404 });
    await expect(
      sut.execute({ investorId, ticker: 'AAPL', quantity: 1 }),
    ).rejects.toMatchObject({ statusCode: 404 });

    for (let index = 0; index < 6; index += 1) {
      await holdingRepository.create({
        investorId,
        assetTicker: `ASSET-${index}`,
        quantity: 1,
      });
    }

    await expect(
      sut.execute({ investorId, ticker: 'AAPL', quantity: 1 }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('lista a carteira de um investidor e rejeita investidor inexistente', async () => {
    await holdingRepository.create({
      investorId,
      assetTicker: 'AAPL',
      quantity: 3,
    });
    const sut = new ListInvestorPortfolioUseCase(
      investorRepository,
      holdingRepository,
    );

    await expect(sut.execute(investorId)).resolves.toHaveLength(1);
    await expect(sut.execute('missing')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('consulta o gateway de mercado', async () => {
    marketDataGateway.assets.set('BTC-USD', {
      ticker: 'BTC-USD',
      name: 'Bitcoin',
      type: 'crypto',
      currency: 'USD',
    });
    const sut = new SearchMarketAssetUseCase(marketDataGateway);

    await expect(sut.execute('BTC-USD')).resolves.toEqual(
      expect.objectContaining({ name: 'Bitcoin' }),
    );
    await expect(sut.execute('UNKNOWN')).resolves.toBeNull();
  });
});
