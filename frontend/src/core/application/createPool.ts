import type { IPools } from "../ports/IPools";
import type { Pool } from "../domain/Pool";
import type { PoolMember } from "../../shared/types/PoolMember";

export async function createPool(
  repo: IPools,
  year: number,
  members: PoolMember[]
): Promise<Pool> {
  return await repo.createPool(year, members);
}
