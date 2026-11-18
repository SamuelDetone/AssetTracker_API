import { CreateAssetUseCase } from '@application/use-cases/CreateAssetUseCase.js';
import { DeleteAssetUseCase } from '@application/use-cases/DeleteAssetUseCase.js';
import { GetAssetByTickerUseCase } from '@application/use-cases/GetAssetByTickerUseCase.js';
import { ListAssetsUseCase } from '@application/use-cases/ListAssetsUseCase.js';
import { UpdateAssetUseCase } from '@application/use-cases/UpdateAssetUseCase.js';
import { InMemoryAssetRepository } from '@tests/mocks/in-memory-asset-repository.js';

const asset = {
  ticker: 'AAPL',
  name: 'Apple Inc.',
  type: 'stock' as const,
  currency: 'USD',
  exchange: 'NASDAQ',
  quantity: 2,
  averagePrice: 180,
};

describe('casos de uso de ativos', () => {
  let assetRepository: InMemoryAssetRepository;

  beforeEach(() => {
    assetRepository = new InMemoryAssetRepository();
  });

  it('cria um ativo e bloqueia ticker duplicado', async () => {
    const sut = new CreateAssetUseCase(assetRepository);

    await expect(sut.execute(asset)).resolves.toEqual(asset);
    await expect(sut.execute(asset)).rejects.toMatchObject({ statusCode: 409 });
  });

  it('lista ativos aplicando filtros', async () => {
    await assetRepository.create(asset);
    await assetRepository.create({
      ...asset,
      ticker: 'MCHI',
      type: 'etf',
      name: 'China ETF',
    });

    const sut = new ListAssetsUseCase(assetRepository);

    await expect(sut.execute({ type: 'etf' })).resolves.toEqual([
      expect.objectContaining({ ticker: 'MCHI' }),
    ]);
  });

  it('busca um ativo existente e retorna 404 quando nao existe', async () => {
    await assetRepository.create(asset);
    const sut = new GetAssetByTickerUseCase(assetRepository);

    await expect(sut.execute('AAPL')).resolves.toEqual(asset);
    await expect(sut.execute('MSFT')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('atualiza um ativo existente e rejeita ticker inexistente', async () => {
    await assetRepository.create(asset);
    const sut = new UpdateAssetUseCase(assetRepository);

    await expect(sut.execute('AAPL', { quantity: 5 })).resolves.toEqual(
      expect.objectContaining({ quantity: 5 }),
    );
    await expect(sut.execute('MSFT', { quantity: 1 })).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('remove um ativo existente e rejeita ticker inexistente', async () => {
    await assetRepository.create(asset);
    const sut = new DeleteAssetUseCase(assetRepository);

    await expect(sut.execute('AAPL')).resolves.toBeUndefined();
    await expect(sut.execute('AAPL')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
