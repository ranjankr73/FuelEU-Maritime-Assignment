import request from "supertest";
import app from "../../src/infrastructure/server";
import { RouteRepository } from "../../src/adapters/outbound/postgres/RouteRepository";
import { ShipComplianceRepository } from "../../src/adapters/outbound/postgres/ShipComplianceRepository";
import { Route } from "../../src/core/domain/Route";

jest.mock("@adapters/outbound/postgres/RouteRepository");
jest.mock("@adapters/outbound/postgres/ShipComplianceRepository");

const MockRouteRepo = RouteRepository as jest.MockedClass<typeof RouteRepository>;
const MockComplianceRepo = ShipComplianceRepository as jest.MockedClass<typeof ShipComplianceRepository>;

describe("/compliance API Integration", () => {
  let mockFindByRouteId: jest.Mock;
  let mockFindByShipAndYear: jest.Mock;
  let mockFindByYear: jest.Mock;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockFindByRouteId = jest.fn();
    mockFindByShipAndYear = jest.fn();
    mockFindByYear = jest.fn();
    mockCreate = jest.fn();

    MockRouteRepo.prototype.findByRouteId = mockFindByRouteId;
    MockComplianceRepo.prototype.findByShipAndYear = mockFindByShipAndYear;
    MockComplianceRepo.prototype.findByYear = mockFindByYear;
    MockComplianceRepo.prototype.create = mockCreate;
  });

  afterEach(() => jest.clearAllMocks());

  it("GET /compliance/cb → calculates and stores compliance balance", async () => {
    const route = new Route(1, "SHIP001", "Container", "LNG", 2025, 88.0, 5000, 12000, 4500);
    mockFindByRouteId.mockResolvedValue(route);
    mockCreate.mockResolvedValue({
      shipId: "SHIP001",
      year: 2025,
      cbGco2eq: 5000000,
    });

    const res = await request(app).get("/compliance/cb?shipId=SHIP001&year=2025");

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("calculated");
    expect(res.body.data.shipId).toBe("SHIP001");
  });

  it("GET /compliance/adjusted-cb → fetches single ship record", async () => {
    mockFindByShipAndYear.mockResolvedValue({
      shipId: "SHIP001",
      year: 2025,
      cbGco2eq: 1000000,
      createdAt: new Date(),
    });

    const res = await request(app).get("/compliance/adjusted-cb?shipId=SHIP001&year=2025");
    expect(res.status).toBe(200);
    expect(res.body.data.shipId).toBe("SHIP001");
  });

  it("GET /compliance/adjusted-cb → returns multiple records when shipId not passed", async () => {
    mockFindByYear.mockResolvedValue([
      { shipId: "A", year: 2025, cbGco2eq: 100 },
      { shipId: "B", year: 2025, cbGco2eq: -50 },
    ]);

    const res = await request(app).get("/compliance/adjusted-cb?year=2025");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });

  it("returns 400 if year param is missing", async () => {
    const res = await request(app).get("/compliance/adjusted-cb");
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Missing required query parameter");
  });
});
