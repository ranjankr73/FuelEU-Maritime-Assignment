import type { IBanking } from "../ports/IBanking";
import type { ApplyResult } from "../../shared/types/ApplyResult";

export async function applyBanked(
  repo: IBanking,
  shipId: string,
  year: number,
  applyAmount: number
): Promise<ApplyResult> {
  return await repo.applyBanked(shipId, year, applyAmount);
}
