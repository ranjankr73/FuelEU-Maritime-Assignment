import type { PoolMember } from "../../shared/types/PoolMember";
import type { Pool } from "../domain/Pool";

export interface IPools {
  createPool(year: number, members: PoolMember[]): Promise<Pool>;
  // getAllPools(): Promise<Pool[]>;
  // getPoolsByYear(year: number): Promise<Pool[]>;
}
