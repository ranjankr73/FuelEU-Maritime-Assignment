import { CreatePool } from "../../src/core/application/usecases/createPool";
import { IPoolRepo } from "../../src/core/ports/outbound/IPoolRepo";
import { Pool } from "../../src/core/domain/Pool";
import { PoolMember } from "../../src/shared/types/PoolMemberInterface";
import { ValidationError } from "../../src/shared/errors/DomainError";

class MockPoolRepo implements IPoolRepo {
  createdPool: Pool | null = null;

  async create(pool: Pool): Promise<Pool> {
    (pool as any).id = 99;
    this.createdPool = pool;
    return pool;
  }

  async findAll(): Promise<Pool[]> {
    return this.createdPool ? [this.createdPool] : [];
  }

  async findByYear(): Promise<Pool[]> {
    return this.createdPool ? [this.createdPool] : [];
  }
}

describe("CreatePoolUseCase", () => {
  let mockRepo: MockPoolRepo;
  let useCase: CreatePool;

  beforeEach(() => {
    mockRepo = new MockPoolRepo();
    useCase = new CreatePool(mockRepo);
  });

  test("creates a valid pool and redistributes CBs correctly", async () => {
    const members: PoolMember[] = [
      { shipId: "S1", cbBefore: 100 },
      { shipId: "S2", cbBefore: -40 },
      { shipId: "S3", cbBefore: -60 },
    ];

    const result = await useCase.execute(2025, members);

    expect(result.year).toBe(2025);
    expect(result.poolId).toBe(99);
    expect(result.poolSum).toBeGreaterThanOrEqual(0);

    const s1 = result.members.find(m => m.shipId === "S1");
    const s2 = result.members.find(m => m.shipId === "S2");
    const s3 = result.members.find(m => m.shipId === "S3");

    expect(s1).toBeDefined();
    expect(s2).toBeDefined();
    expect(s3).toBeDefined();

    expect(s1!.cbAfter).toBeGreaterThanOrEqual(0);
    expect(s2!.cbAfter).toBeGreaterThanOrEqual(s2!.cbBefore);
    expect(s3!.cbAfter).toBeGreaterThanOrEqual(s3!.cbBefore);
  });

  test("throws ValidationError for empty members list", async () => {
    await expect(useCase.execute(2025, [])).rejects.toThrow(ValidationError);
  });

  test("throws ValidationError when year is missing", async () => {
    const members: PoolMember[] = [
      { shipId: "A", cbBefore: 10 },
      { shipId: "B", cbBefore: -10 },
    ];
    await expect(useCase.execute(undefined as any, members))
      .rejects.toThrow(ValidationError);
  });

  test("throws BusinessRuleViolationError for invalid (negative) pool total", async () => {
    const members: PoolMember[] = [
      { shipId: "A", cbBefore: -20 },
      { shipId: "B", cbBefore: -10 },
    ];

    await expect(useCase.execute(2025, members)).rejects.toThrow();
  });

  test("ensures deficit ships do not exit worse", async () => {
    const members: PoolMember[] = [
      { shipId: "S1", cbBefore: 50 },
      { shipId: "S2", cbBefore: -20 },
    ];

    const result = await useCase.execute(2025, members);
    const deficit = result.members.find(m => m.shipId === "S2");

    expect(deficit!.cbAfter).toBeGreaterThanOrEqual(deficit!.cbBefore);
  });

  test("ensures surplus ships never go negative", async () => {
    const members: PoolMember[] = [
      { shipId: "S1", cbBefore: 40 },
      { shipId: "S2", cbBefore: -10 },
      { shipId: "S3", cbBefore: -30 },
    ];

    const result = await useCase.execute(2025, members);
    const surplus = result.members.find(m => m.shipId === "S1");

    expect(surplus?.cbAfter).toBeGreaterThanOrEqual(0);
  });
});
