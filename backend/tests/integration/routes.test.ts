import request from "supertest";
import app from "../../src/infrastructure/server";
import { Route } from "../../src/core/domain/Route";
import { RouteRepository } from "../../src/adapters/outbound/postgres/RouteRepository";

jest.mock("@adapters/outbound/postgres/RouteRepository");

const MockRepo = RouteRepository as jest.MockedClass<typeof RouteRepository>;

describe("/routes API Integration", () => {
  let mockFindAll: jest.Mock;
  let mockFindBaseline: jest.Mock;
  let mockSetBaseline: jest.Mock;

  beforeEach(() => {
    mockFindAll = jest.fn();
    mockFindBaseline = jest.fn();
    mockSetBaseline = jest.fn();

    MockRepo.prototype.findAll = mockFindAll;
    MockRepo.prototype.findBaseline = mockFindBaseline;
    MockRepo.prototype.setBaseline = mockSetBaseline;
  });

  afterEach(() => jest.clearAllMocks());

  it("GET /routes → returns list of routes", async () => {
    mockFindAll.mockResolvedValue([
      new Route(1, "R001", "Container", "HFO", 2024, 91, 5000, 12000, 4500),
    ]);

    const res = await request(app).get("/routes");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].routeId).toBe("R001");
  });

  it("POST /routes/:id/baseline → updates baseline", async () => {
    mockSetBaseline.mockResolvedValue(
      new Route(1, "R001", "Container", "HFO", 2024, 91, 5000, 12000, 4500, true)
    );

    const res = await request(app).post("/routes/1/baseline");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Baseline route updated successfully.");
    expect(res.body.data.isBaseline).toBe(true);
  });

  it("POST /routes/:id/baseline → rejects invalid ID", async () => {
    const res = await request(app).post("/routes/abc/baseline");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid route ID.");
  });

  it("GET /routes/comparison → returns comparison data", async () => {
    const baseline = new Route(1, "R001", "Container", "HFO", 2024, 91, 5000, 12000, 4500, true);
    const others = [
      baseline,
      new Route(2, "R002", "LNG", "BulkCarrier", 2024, 88, 4800, 11500, 4200),
    ];

    mockFindBaseline.mockResolvedValue(baseline);
    mockFindAll.mockResolvedValue(others);

    const res = await request(app).get("/routes/comparison");

    expect(res.status).toBe(200);
    expect(res.body.baseline).toBe("R001");
    expect(res.body.targetIntensity).toBeDefined();
    expect(res.body.comparisons).toHaveLength(1);
    expect(res.body.comparisons[0].routeId).toBe("R002");
  });

  it("GET /routes/comparison → returns 404 if baseline not found", async () => {
    mockFindBaseline.mockResolvedValue(null);
    mockFindAll.mockResolvedValue([]);

    const res = await request(app).get("/routes/comparison");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("No baseline route found.");
  });
});
