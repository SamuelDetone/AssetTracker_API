export type Investor = {
  id: string;
  name: string;
  email: string;
};

export type CreateInvestorInput = Omit<Investor, 'id'> & {
  id?: string;
};
