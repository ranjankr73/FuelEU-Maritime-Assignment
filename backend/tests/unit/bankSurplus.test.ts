import { BankSurplus } from "../../src/core/application/usecases/bankSurplus";
import { Bank } from "../../src/core/domain/Bank";
import { IBankRepo } from "../../src/core/ports/outbound/IBankRepo";
import { ValidationError } from "../../src/shared/errors/DomainError";

class MockBankRepo implements IBankRepo {
  created: Bank | null = null;

  async create(bank: Bank): Promise<Bank> {
    this.created = bank;
    return bank;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<Bank | null> {
    return null;
  }

  async update(bank: Bank): Promise<Bank> {
    return bank;
  }

  async findAll(): Promise<Bank[]> {
    return [];
  }
}

describe("BankSurplusUseCase", () => {
  it("banks a positive CB successfully", async () => {
    const mockRepo = new MockBankRepo();
    const useCase = new BankSurplus(mockRepo);

    const result = await useCase.execute("SHIP001", 2024, 1200);

    expect(result.shipId).toBe("SHIP001");
    expect(result.year).toBe(2024);
    expect(result.amount).toBe(1200);
    expect(mockRepo.created).not.toBeNull();
    expect(mockRepo.created?.amount).toBe(1200);
  });

  it("throws error when CB is not positive", async () => {
    const mockRepo = new MockBankRepo();
    const useCase = new BankSurplus(mockRepo);
    await expect(useCase.execute("SHIP001", 2024, -500))
      .rejects.toThrow("Only positive CB can be banked.");
  });

  it("throws ValidationError if shipId is missing", async () => {
    const mockRepo = new MockBankRepo();
    const useCase = new BankSurplus(mockRepo);
    await expect(useCase.execute("", 2024, 500))
      .rejects.toThrow("Ship ID is required.");
  });

  it("throws ValidationError if year is missing", async () => {
    const mockRepo = new MockBankRepo();
    const useCase = new BankSurplus(mockRepo);
    await expect(useCase.execute("SHIP001", 0, 500))
      .rejects.toThrow("Year is required.");
  });
});
