import api from "./apiClient";
import type { IBanking } from "../../core/ports/IBanking";
import type { BankRecord } from "../../shared/types/BankRecord";
import type { ApplyResult } from "../../shared/types/ApplyResult";

export class BankingApi implements IBanking {
  async getBankingRecords(shipId: string, year?: number): Promise<BankRecord[]> {
    const query = year
      ? `/banking/records?shipId=${shipId}&year=${year}`
      : `/banking/records?shipId=${shipId}`;
    const { data } = await api.get<{ data: BankRecord[] }>(query);
    return data.data;
  }

  async bankSurplus(
    shipId: string,
    year: number,
    amountGco2eq: number
  ): Promise<BankRecord> {
    const { data } = await api.post<{ data: BankRecord }>("/banking/bank", {
      shipId,
      year,
      amountGco2eq,
    });
    return data.data;
  }

  async applyBanked(
    shipId: string,
    year: number,
    applyAmount: number
  ): Promise<ApplyResult> {
    const { data } = await api.post<{ data: ApplyResult }>("/banking/apply", {
      shipId,
      year,
      applyAmount,
    });
    return data.data;
  }
}
