import { AuthenticateInvestorUseCase } from '@application/use-cases/AuthenticateInvestorUseCase.js';
import { GetCurrentInvestorUseCase } from '@application/use-cases/GetCurrentInvestorUseCase.js';
import { LogoutInvestorUseCase } from '@application/use-cases/LogoutInvestorUseCase.js';
import { RefreshInvestorSessionUseCase } from '@application/use-cases/RefreshInvestorSessionUseCase.js';
import { UpdateInvestorRoleUseCase } from '@application/use-cases/UpdateInvestorRoleUseCase.js';
import { FakeHashProvider } from '@tests/mocks/fake-hash-provider.js';
import { FakeTokenProvider } from '@tests/mocks/fake-token-provider.js';
import { InMemoryInvestorRepository } from '@tests/mocks/in-memory-investor-repository.js';
import { InMemoryTokenRepository } from '@tests/mocks/in-memory-token-repository.js';

describe('casos de uso de investidor e sessao', () => {
  let investorRepository: InMemoryInvestorRepository;
  let tokenRepository: InMemoryTokenRepository;
  let hashProvider: FakeHashProvider;
  let tokenProvider: FakeTokenProvider;
  const investorId = 'investor-id';

  beforeEach(async () => {
    investorRepository = new InMemoryInvestorRepository();
    tokenRepository = new InMemoryTokenRepository();
    hashProvider = new FakeHashProvider();
    tokenProvider = new FakeTokenProvider();

    await investorRepository.create({
      id: investorId,
      name: 'Samuel Detone',
      email: 'samuel@example.com',
      password: 'hashed:senha-segura',
    });
  });

  it('autentica um investidor e persiste o refresh token', async () => {
    const sut = new AuthenticateInvestorUseCase(
      investorRepository,
      hashProvider,
      tokenProvider,
      tokenRepository,
    );

    const session = await sut.execute({
      email: 'samuel@example.com',
      password: 'senha-segura',
    });

    expect(session).toEqual(
      expect.objectContaining({
        accessToken: 'access-token-1',
        refreshToken: 'refresh-token-1',
      }),
    );
    await expect(
      tokenRepository.findRefreshToken(session.refreshToken),
    ).resolves.toEqual(expect.objectContaining({ investorId }));
  });

  it('rejeita credenciais quando o investidor nao existe ou a senha esta errada', async () => {
    const sut = new AuthenticateInvestorUseCase(
      investorRepository,
      hashProvider,
      tokenProvider,
      tokenRepository,
    );

    await expect(
      sut.execute({ email: 'missing@example.com', password: 'senha' }),
    ).rejects.toMatchObject({ statusCode: 401 });
    await expect(
      sut.execute({ email: 'samuel@example.com', password: 'errada' }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('retorna o perfil atual e permite atualizar seu papel', async () => {
    const currentInvestor = new GetCurrentInvestorUseCase(investorRepository);
    const updateRole = new UpdateInvestorRoleUseCase(investorRepository);

    await expect(currentInvestor.execute(investorId)).resolves.toEqual(
      expect.objectContaining({ id: investorId, role: 'USER' }),
    );
    await expect(updateRole.execute(investorId, 'ADMIN')).resolves.toEqual(
      expect.objectContaining({ role: 'ADMIN' }),
    );
    await expect(currentInvestor.execute('missing')).rejects.toMatchObject({
      statusCode: 404,
    });
    await expect(updateRole.execute('missing', 'ADMIN')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('rotaciona refresh token e rejeita token ja utilizado', async () => {
    const refreshToken = 'refresh-token-atual';
    tokenProvider.registerRefreshToken(refreshToken, {
      subject: investorId,
      role: 'USER',
    });
    await tokenRepository.createRefreshToken(
      investorId,
      refreshToken,
      tokenProvider.getRefreshTokenExpiresAt(refreshToken),
    );
    const sut = new RefreshInvestorSessionUseCase(
      investorRepository,
      tokenProvider,
      tokenRepository,
    );

    const session = await sut.execute(refreshToken);

    expect(session.refreshToken).toBe('refresh-token-1');
    await expect(
      tokenRepository.findRefreshToken(refreshToken),
    ).resolves.toBeNull();
    await expect(sut.execute(refreshToken)).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('rejeita refresh com assinatura invalida, token sem registro ou investidor removido', async () => {
    const sut = new RefreshInvestorSessionUseCase(
      investorRepository,
      tokenProvider,
      tokenRepository,
    );

    tokenProvider.failRefreshTokenVerification = true;
    await expect(sut.execute('invalid')).rejects.toMatchObject({
      statusCode: 401,
    });

    tokenProvider.failRefreshTokenVerification = false;
    tokenProvider.registerRefreshToken('not-stored', {
      subject: investorId,
      role: 'USER',
    });
    await expect(sut.execute('not-stored')).rejects.toMatchObject({
      statusCode: 401,
    });

    tokenProvider.registerRefreshToken('orphan', {
      subject: 'missing-investor',
      role: 'USER',
    });
    await tokenRepository.createRefreshToken(
      'missing-investor',
      'orphan',
      tokenProvider.getRefreshTokenExpiresAt('orphan'),
    );
    await expect(sut.execute('orphan')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('rejeita e expurga refresh token expirado', async () => {
    const refreshToken = 'refresh-token-expirado';
    tokenProvider.registerRefreshToken(refreshToken, {
      subject: investorId,
      role: 'USER',
    });
    await tokenRepository.createRefreshToken(
      investorId,
      refreshToken,
      new Date(Date.now() - 1_000),
    );
    const sut = new RefreshInvestorSessionUseCase(
      investorRepository,
      tokenProvider,
      tokenRepository,
    );

    await expect(sut.execute(refreshToken)).rejects.toMatchObject({
      statusCode: 401,
    });
    await expect(
      tokenRepository.findRefreshToken(refreshToken),
    ).resolves.toBeNull();
  });

  it('encerra a sessao, invalida o access token e trata token invalido', async () => {
    const refreshToken = 'refresh-token-atual';
    await tokenRepository.createRefreshToken(
      investorId,
      refreshToken,
      tokenProvider.getRefreshTokenExpiresAt(refreshToken),
    );
    const sut = new LogoutInvestorUseCase(tokenProvider, tokenRepository);

    await sut.execute(investorId, 'access-token-atual');

    await expect(
      tokenRepository.isAccessTokenInvalidated('access-token-atual'),
    ).resolves.toBe(true);
    await expect(
      tokenRepository.findRefreshToken(refreshToken),
    ).resolves.toBeNull();

    tokenProvider.failAccessTokenExpiration = true;
    await expect(sut.execute(investorId, 'invalid')).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});
