import { CreateInvestorUseCase } from '@application/use-cases/CreateInvestorUseCase.js';
import { FakeHashProvider } from '@tests/mocks/fake-hash-provider.js';
import { InMemoryInvestorRepository } from '@tests/mocks/in-memory-investor-repository.js';

describe('CreateInvestorUseCase', () => {
  let investorRepository: InMemoryInvestorRepository;
  let hashProvider: FakeHashProvider;
  let sut: CreateInvestorUseCase;

  beforeEach(() => {
    investorRepository = new InMemoryInvestorRepository();
    hashProvider = new FakeHashProvider();
    sut = new CreateInvestorUseCase(investorRepository, hashProvider);
  });

  it('deve criar um investidor e nao expor sua senha', async () => {
    const investor = await sut.execute({
      name: 'Samuel Detone',
      email: 'samuel@example.com',
      password: 'senha-segura',
    });

    expect(investor).toEqual({
      id: expect.any(String),
      name: 'Samuel Detone',
      email: 'samuel@example.com',
      role: 'USER',
    });
    expect(investor).not.toHaveProperty('password');
    expect(investorRepository.investors[0].password).toBe(
      'hashed:senha-segura',
    );
  });

  it('deve rejeitar um e-mail que ja pertence a outro investidor', async () => {
    await sut.execute({
      name: 'Samuel Detone',
      email: 'samuel@example.com',
      password: 'senha-segura',
    });

    await expect(
      sut.execute({
        name: 'Outro Samuel',
        email: 'SAMUEL@EXAMPLE.COM',
        password: 'outra-senha',
      }),
    ).rejects.toMatchObject({
      name: 'AppError',
      statusCode: 409,
    });
  });
});
