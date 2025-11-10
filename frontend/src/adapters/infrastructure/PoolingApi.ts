import api from "./apiClient";
import type { IPools } from "../../core/ports/IPools";
import type { Pool } from "../../core/domain/Pool";
import type { PoolMember } from "../../shared/types/PoolMember";

export class PoolsApi implements IPools {
  async createPool(year: number, members: PoolMember[]): Promise<Pool> {
    const { data } = await api.post<{ data: Pool }>("/pools", { year, members });
    return data.data;
  }

  // async getAllPools(): Promise<Pool[]> {
  //   const { data } = await api.get<{ data: Pool[] }>("/pools");
  //   return data.data;
  // }

  // async getPoolsByYear(year: number): Promise<Pool[]> {
  //   const { data } = await api.get<{ data: Pool[] }>(`/pools?year=${year}`);
  //   return data.data;
  // }
}
