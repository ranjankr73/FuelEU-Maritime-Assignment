import api from "./apiClient";

export interface CBResult {
  shipId: string;
  year: number;
  cb_gco2eq: number;
  status: "Surplus" | "Deficit" | "Neutral";
}

export interface BankRecord {
  id: number;
  shipId: string;
  year: number;
  amount_gco2eq: number;
  createdAt: string;
}

export class BankingApi {
  async getComplianceCB(routeId: string, year: number): Promise<CBResult> {
    const res = await api.get(`/compliance/cb?routeId=${routeId}&year=${year}`);
    return res.data;
  }

  async getBankRecords(shipId: string, year?: number): Promise<BankRecord[]> {
    const query = year ? `?shipId=${shipId}&year=${year}` : `?shipId=${shipId}`;
    const res = await api.get(`/banking/records${query}`);
    return res.data;
  }

  async bankSurplus(shipId: string, year: number, amount: number) {
    const res = await api.post("/banking/bank", {
      shipId,
      year,
      amount_gco2eq: amount,
    });
    return res.data;
  }

  async applyBanked(shipId: string, year: number, applyAmount: number) {
    const res = await api.post("/banking/apply", {
      shipId,
      year,
      applyAmount,
    });
    return res.data;
  }
}
