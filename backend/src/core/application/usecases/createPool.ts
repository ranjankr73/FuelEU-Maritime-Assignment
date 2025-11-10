import { Pool } from "../../domain/Pool";
import { IPoolRepo } from "../../ports/outbound/IPoolRepo";
import { PoolMember } from "../../../shared/types/PoolMemberInterface";
import {
  ValidationError,
  BusinessRuleViolationError,
} from "../../../shared/errors/DomainError";

export class CreatePool {
  constructor(private poolRepo: IPoolRepo) {}

  async execute(
    year: number,
    members: PoolMember[]
  ): Promise<{
    poolId: number;
    year: number;
    poolSum: number;
    members: PoolMember[];
  }> {

    if (!year) throw new ValidationError("Year is required.");
    if (!members || members.length === 0)
      throw new ValidationError("At least one pool member is required.");

    const pool = new Pool(year, members);

    if (!pool.isValid()) {
      throw new BusinessRuleViolationError(
        "Invalid pool: total compliance balance must be >= 0"
      );
    }

    const adjustedMembers = pool.applyPoolingRules();
    pool.members = adjustedMembers;

    const savedPool = await this.poolRepo.create(pool);

    return {
      poolId: savedPool.id ?? 0,
      year: savedPool.year,
      poolSum: savedPool.totalCB(),
      members: adjustedMembers,
    };
  }
}
