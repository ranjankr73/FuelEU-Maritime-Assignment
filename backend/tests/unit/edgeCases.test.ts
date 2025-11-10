import { computeCB } from "../../src/core/application/usecases/computeCB";
import { CreatePool } from "../../src/core/application/usecases/createPool";
import { IPoolRepo } from "../../src/core/ports/outbound/IPoolRepo";
import { Pool } from "../../src/core/domain/Pool";
import { PoolMember } from "../../src/shared/types/PoolMemberInterface";
import { BusinessRuleViolationError } from "../../src/shared/errors/DomainError";
import { TARGET_INTENSITY } from "../../src/shared/constants";

class MockPoolRepo implements IPoolRepo {
  create = jest.fn(async (pool: Pool) => pool);
  findByYear = jest.fn();
  findAll = jest.fn();
}

describe("Edge Cases", () => {
  it("should throw BusinessRuleViolationError for invalid (negative) total pool CB", async () => {
    const useCase = new CreatePool(new MockPoolRepo());
    const invalidMembers: PoolMember[] = [
      { shipId: "A", cbBefore: -200 },
      { shipId: "B", cbBefore: -100 },
    ];

    await expect(useCase.execute(2025, invalidMembers))
      .rejects.toThrow(BusinessRuleViolationError);
    await expect(useCase.execute(2025, invalidMembers))
      .rejects.toThrow("Invalid pool: total compliance balance must be >= 0");
  });

  it("should return negative CB for very high GHG intensity", () => {
    // ghgIntensity > TARGET_INTENSITY → Deficit
    const result = computeCB("S1", 2025, TARGET_INTENSITY + 5, 1000);

    expect(result.cb).toBeLessThan(0);
    expect(result.status).toBe("Deficit");
  });

  it("should return large positive CB for very low GHG intensity", () => {
    // ghgIntensity < TARGET_INTENSITY → Surplus
    const result = computeCB("S2", 2025, TARGET_INTENSITY - 10, 5000);

    expect(result.cb).toBeGreaterThan(0);
    expect(result.status).toBe("Surplus");
  });

  it("should handle zero total CB in perfectly balanced pool", async () => {
    const useCase = new CreatePool(new MockPoolRepo());
    const members: PoolMember[] = [
      { shipId: "A", cbBefore: 100 },
      { shipId: "B", cbBefore: -100 },
    ];

    const result = await useCase.execute(2025, members);

    expect(result.poolSum).toBeCloseTo(0, 6);
    expect(result.members.every(m => Math.abs(m.cbAfter!) <= Math.abs(m.cbBefore))).toBe(true);
  });
});
