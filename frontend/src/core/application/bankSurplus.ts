import type { IBanking } from "../ports/IBanking";
import type { BankRecord } from "../../shared/types/BankRecord";

export async function bankSurplus(
  repo: IBanking,
  shipId: string,
  year: number,
  amountGco2eq: number
): Promise<BankRecord> {
  return await repo.bankSurplus(shipId, year, amountGco2eq);
}
