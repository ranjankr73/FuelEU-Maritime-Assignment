import { CalculateCompliance } from "../../src/core/application/usecases/calculateCompliance";
import { IShipComplianceRepo } from "../../src/core/ports/outbound/IShipComplianceRepo";
import { Route } from "../../src/core/domain/Route";
import { ShipComplianceRecord } from "../../src/shared/types/ShipComplianceRecord";
import { ValidationError } from "../../src/shared/errors/DomainError";

class MockComplianceRepo implements IShipComplianceRepo {
  saved: ShipComplianceRecord | null = null;

  async create(record: ShipComplianceRecord): Promise<ShipComplianceRecord> {
    this.saved = record;
    return record;
  }

  async findByShipAndYear(): Promise<ShipComplianceRecord | null> {
    return null;
  }

  async findAll(): Promise<ShipComplianceRecord[]> {
    return [];
  }

  async findByYear(): Promise<ShipComplianceRecord[]> {
    return [];
  }
}

describe("CalculateComplianceUseCase", () => {
  it("computes and saves compliance balance correctly", async () => {
    const repo = new MockComplianceRepo();
    const useCase = new CalculateCompliance(repo);

    const route = new Route(1, "SHIP001", "Container", "LNG", 2025, 88.0, 5000, 12000, 4500);
    const result = await useCase.execute(route);

    expect(result.shipId).toBe("SHIP001");
    expect(result.status).toBe("Surplus");
    expect(result.cbGco2eq).toBeDefined();
    expect(repo.saved).not.toBeNull();
    expect(repo.saved?.cbGco2eq).toBeCloseTo(result.cbGco2eq, 6);
  });

  it("throws validation error when route is missing", async () => {
    const repo = new MockComplianceRepo();
    const useCase = new CalculateCompliance(repo);
    await expect(useCase.execute(undefined as any)).rejects.toThrow(ValidationError);
    await expect(useCase.execute(undefined as any)).rejects.toThrow("Route data is required.");
  });

  it("marks as Deficit when CB is negative", async () => {
    const repo = new MockComplianceRepo();
    const useCase = new CalculateCompliance(repo);

    const route = new Route(2, "SHIP002", "Tanker", "HFO", 2025, 95.0, 5000, 12000, 4500);
    const result = await useCase.execute(route);

    expect(result.status).toBe("Deficit");
    expect(result.cbGco2eq).toBeLessThan(0);
  });

  it("marks as Neutral when CB is zero", async () => {
    const repo = new MockComplianceRepo();
    const useCase = new CalculateCompliance(repo);

    const route = new Route(3, "SHIP003", "RoRo", "LNG", 2025, 89.3368, 5000, 12000, 4500);
    const result = await useCase.execute(route);

    expect(result.status).toBe("Neutral");
    expect(result.cbGco2eq).toBeCloseTo(0, 6);
  });
});
