import type { ICompliance } from "../ports/ICompliance";
import type { ComplianceRecord } from "../../shared/types/ComplianceRecord";

export async function fetchComplianceCB(
  repo: ICompliance,
  shipId: string,
  year: number
): Promise<ComplianceRecord> {
  return await repo.getComplianceCB(shipId, year);
}
