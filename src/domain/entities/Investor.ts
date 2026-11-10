export type InvestorRole = 'USER' | 'ADMIN';

export type Investor = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: InvestorRole;
};

export type InvestorProfile = Omit<Investor, 'password'>;

export type CreateInvestorInput = Pick<
  Investor,
  'name' | 'email' | 'password'
> & {
  id?: string;
};
