import type { BankRecord } from "../../shared/types/BankRecord";
import type { ApplyResult } from "../../shared/types/ApplyResult";

export interface IBanking {
  getBankingRecords(shipId: string, year?: number): Promise<BankRecord[]>;
  bankSurplus(
    shipId: string,
    year: number,
    amountGco2eq: number
  ): Promise<BankRecord>;
  applyBanked(
    shipId: string,
    year: number,
    applyAmount: number
  ): Promise<ApplyResult>;
}
