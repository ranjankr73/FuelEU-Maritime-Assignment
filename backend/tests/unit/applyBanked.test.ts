import { ApplyBanked } from "../../src/core/application/usecases/applyBanked";
import { IBankRepo } from "../../src/core/ports/outbound/IBankRepo";
import { IShipComplianceRepo } from "../../src/core/ports/outbound/IShipComplianceRepo";
import { Bank } from "../../src/core/domain/Bank";
import { ShipComplianceRecord } from "../../src/shared/types/ShipComplianceRecord";

class MockBankRepo implements IBankRepo {
  data = [new Bank("S1", 2023, 100), new Bank("S1", 2024, 50)];

  async create(bank: Bank) {
    this.data.push(bank);
    return bank;
  }
  async findByShipAndYear() { return null; }
  async update(bank: Bank) {
    const idx = this.data.findIndex((b) => b.shipId === bank.shipId && b.year === bank.year);
    if (idx !== -1) this.data[idx] = bank;
    return bank;
  }
  async findAll() { return this.data; }
}

class MockComplianceRepo implements IShipComplianceRepo {
  record = { shipId: "S1", year: 2025, cbGco2eq: -50 };

  async create(record: ShipComplianceRecord): Promise<ShipComplianceRecord> { this.record = record; return record; }
  async findByShipAndYear(shipId: string, year: number): Promise<ShipComplianceRecord | null> { return this.record; }
  async findAll(): Promise<ShipComplianceRecord[]> { return [this.record]; }
  async findByYear(year: number): Promise<ShipComplianceRecord[]> { return [this.record]; }
}

describe("ApplyBankedUseCase", () => {
  it("applies banked surplus successfully", async () => {
    const useCase = new ApplyBanked(new MockBankRepo(), new MockComplianceRepo());
    const result = await useCase.execute("S1", 2025, 120);

    expect(result.cbBefore).toBe(-50);
    expect(result.applied).toBe(120);
    expect(result.cbAfter).toBe(70);
  });

  it("throws ValidationError for negative applyAmount", async () => {
    const useCase = new ApplyBanked(new MockBankRepo(), new MockComplianceRepo());
    await expect(useCase.execute("S1", 2025, -100)).rejects.toThrow("positive");
  });

  it("throws BusinessRuleViolationError for insufficient banked balance", async () => {
    const useCase = new ApplyBanked(new MockBankRepo(), new MockComplianceRepo());
    await expect(useCase.execute("S1", 2025, 1000)).rejects.toThrow("Insufficient");
  });

  it("throws EntityNotFoundError if compliance record missing", async () => {
    const badRepo = new MockComplianceRepo();
    badRepo.findByShipAndYear = async () => null;
    const useCase = new ApplyBanked(new MockBankRepo(), badRepo);
    await expect(useCase.execute("S1", 2025, 50)).rejects.toThrow("ShipCompliance");
  });
});
