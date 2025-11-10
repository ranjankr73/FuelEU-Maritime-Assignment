import api from "./apiClient";

export interface AdjustedCB {
  shipId: string;
  cb_gco2eq: number;
}

export interface PoolMember {
  shipId: string;
  cb_before: number;
}

export interface PoolResult {
  poolId: number;
  year: number;
  poolSum: number;
  members: { shipId: string; cb_before: number; cb_after: number }[];
}

export class PoolingApi {
  async getAdjustedCB(year: number): Promise<AdjustedCB[]> {
    const res = await api.get(`/compliance/adjusted-cb?year=${year}`);
    return res.data;
  }

  async createPool(year: number, members: PoolMember[]): Promise<PoolResult> {
    const res = await api.post("/pools", { year, members });
    return res.data;
  }
}
