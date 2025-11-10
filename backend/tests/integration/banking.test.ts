import request from "supertest";
import app from "../../src/infrastructure/server";
import { BankRepository } from "../../src/adapters/outbound/postgres/BankRepository";
import { ShipComplianceRepository } from "../../src/adapters/outbound/postgres/ShipComplianceRepository";
import { Bank } from "../../src/core/domain/Bank";

jest.mock("@adapters/outbound/postgres/BankRepository");
jest.mock("@adapters/outbound/postgres/ShipComplianceRepository");

const MockBankRepo = BankRepository as jest.MockedClass<typeof BankRepository>;
const MockComplianceRepo = ShipComplianceRepository as jest.MockedClass<typeof ShipComplianceRepository>;

describe("/banking API Integration", () => {
  let mockFindAll: jest.Mock;
  let mockFindByShipAndYear: jest.Mock;
  let mockCreate: jest.Mock;
  let mockUpdate: jest.Mock;

  let mockFindByShipAndYearCompliance: jest.Mock;
  let mockCreateCompliance: jest.Mock;

  beforeEach(() => {
    mockFindAll = jest.fn();
    mockFindByShipAndYear = jest.fn();
    mockCreate = jest.fn();
    mockUpdate = jest.fn();

    mockFindByShipAndYearCompliance = jest.fn();
    mockCreateCompliance = jest.fn();

    MockBankRepo.prototype.findAll = mockFindAll;
    MockBankRepo.prototype.findByShipAndYear = mockFindByShipAndYear;
    MockBankRepo.prototype.create = mockCreate;
    MockBankRepo.prototype.update = mockUpdate;

    MockComplianceRepo.prototype.findByShipAndYear = mockFindByShipAndYearCompliance;
    MockComplianceRepo.prototype.create = mockCreateCompliance;
  });

  afterEach(() => jest.clearAllMocks());

  it("GET /banking/records → returns bank records for ship/year", async () => {
    mockFindByShipAndYear.mockResolvedValue(new Bank("S1", 2025, 1200));

    const res = await request(app).get("/banking/records?shipId=S1&year=2025");

    expect(res.status).toBe(200);
    expect(res.body.data[0].shipId).toBe("S1");
    expect(res.body.data[0].amount).toBe(1200);
  });

  it("POST /banking/bank → successfully banks surplus CB", async () => {
    mockCreate.mockResolvedValue(new Bank("S1", 2025, 1500));

    const res = await request(app)
      .post("/banking/bank")
      .send({ shipId: "S1", year: 2025, amountGco2eq: 1500 });

    expect(res.status).toBe(201);
    expect(res.body.data.shipId).toBe("S1");
    expect(res.body.data.amount).toBe(1500);
    expect(res.body.message).toContain("banked successfully");
  });

  it("POST /banking/apply → applies banked surplus correctly", async () => {

    mockFindAll.mockResolvedValue([
      new Bank("S1", 2023, 100),
      new Bank("S1", 2024, 300),
    ]);

    mockFindByShipAndYearCompliance.mockResolvedValue({
      shipId: "S1",
      year: 2025,
      cbGco2eq: -50,
    });

    mockCreateCompliance.mockResolvedValue({
      shipId: "S1",
      year: 2025,
      cbGco2eq: 250,
    });

    const res = await request(app)
      .post("/banking/apply")
      .send({ shipId: "S1", year: 2025, applyAmount: 300 });

    expect(res.status).toBe(200);
    expect(res.body.data.cbAfter).toBe(250);
    expect(res.body.message).toContain("applied successfully");
  });

  it("GET /banking/records → returns 404 if no records", async () => {
    mockFindByShipAndYear.mockResolvedValue(null);
    const res = await request(app).get("/banking/records?shipId=NONE&year=2025");
    expect(res.status).toBe(404);
    expect(res.body.error).toContain("No bank records");
  });

  it("POST /banking/bank → returns 400 if parameters missing", async () => {
    const res = await request(app).post("/banking/bank").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("shipId");
  });

  it("POST /banking/apply → rejects if applyAmount > available balance", async () => {
    mockFindAll.mockResolvedValue([new Bank("S1", 2025, 100)]);
    mockFindByShipAndYearCompliance.mockResolvedValue({
      shipId: "S1",
      year: 2025,
      cbGco2eq: 0,
    });

    const res = await request(app)
      .post("/banking/apply")
      .send({ shipId: "S1", year: 2025, applyAmount: 9999 });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain("Insufficient banked balance");
  });
});
