import type { ICompliance } from "../ports/ICompliance";
import type { ComplianceRecord } from "../../shared/types/ComplianceRecord";

export async function fetchAdjustedCB(
  repo: ICompliance,
  year: number,
  shipId?: string
): Promise<ComplianceRecord[]> {
  return await repo.getAdjustedCB(year, shipId);
}
