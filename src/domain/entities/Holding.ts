import { Asset } from './Asset.js';

export type Holding = {
  id: string;
  investorId: string;
  assetTicker: string;
  quantity: number;
  active: boolean;
  asset?: Asset;
};

export type CreateHoldingInput = {
  investorId: string;
  assetTicker: string;
  quantity: number;
};
