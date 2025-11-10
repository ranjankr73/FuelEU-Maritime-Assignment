import api from "./apiClient";
import type { ICompliance } from "../../core/ports/ICompliance";
import type { ComplianceRecord } from "../../shared/types/ComplianceRecord";

export class ComplianceApi implements ICompliance {
  async getComplianceCB(shipId: string, year: number): Promise<ComplianceRecord> {
    const { data } = await api.get<{ data: ComplianceRecord }>(
      `/compliance/cb?shipId=${shipId}&year=${year}`
    );
    return data.data;
  }

  async getAdjustedCB(year: number, shipId?: string): Promise<ComplianceRecord[]> {
    const query = shipId
      ? `/compliance/adjusted-cb?shipId=${shipId}&year=${year}`
      : `/compliance/adjusted-cb?year=${year}`;
    const { data } = await api.get<{ data: ComplianceRecord[] }>(query);
    return data.data;
  }
}
