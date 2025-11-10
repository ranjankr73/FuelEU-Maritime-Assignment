import type { ComplianceRecord } from "../../shared/types/ComplianceRecord";

export interface ICompliance {
  getComplianceCB(shipId: string, year: number): Promise<ComplianceRecord>;
  getAdjustedCB(year: number, shipId?: string): Promise<ComplianceRecord[]>;
}
