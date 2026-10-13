import { Request, Response } from 'express';

import { AddHoldingToPortfolioUseCase } from '../../../application/use-cases/AddHoldingToPortfolioUseCase.js';
import { CreateInvestorUseCase } from '../../../application/use-cases/CreateInvestorUseCase.js';
import { ListInvestorPortfolioUseCase } from '../../../application/use-cases/ListInvestorPortfolioUseCase.js';
import { AppError } from '../../../domain/errors/AppError.js';

export class InvestorController {
  constructor(
    private readonly createInvestorUseCase: CreateInvestorUseCase,
    private readonly addHoldingToPortfolioUseCase: AddHoldingToPortfolioUseCase,
    private readonly listInvestorPortfolioUseCase: ListInvestorPortfolioUseCase,
  ) {}

  create = async (request: Request, response: Response): Promise<Response> => {
    const investor = await this.createInvestorUseCase.execute(request.body);

    return response.status(201).json(investor);
  };

  addHolding = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const investorId = this.getInvestorIdFromParams(request);
    const holding = await this.addHoldingToPortfolioUseCase.execute({
      investorId,
      ticker: request.body.ticker,
      quantity: request.body.quantity,
    });

    return response.status(201).json(holding);
  };

  listPortfolio = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const investorId = this.getInvestorIdFromParams(request);
    const portfolio =
      await this.listInvestorPortfolioUseCase.execute(investorId);

    return response.json(portfolio);
  };

  private getInvestorIdFromParams(request: Request): string {
    const investorId = request.params.investorId;

    if (!investorId || Array.isArray(investorId)) {
      throw new AppError('Invalid investor id.', 400);
    }

    return investorId;
  }
}
