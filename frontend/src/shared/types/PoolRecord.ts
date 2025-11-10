import type { PoolMember } from "./PoolMember";

export interface PoolRecord {
  id?: number;
  year: number;
  totalCB: number;
  members: PoolMember[];
  createdAt?: string | Date;
}
