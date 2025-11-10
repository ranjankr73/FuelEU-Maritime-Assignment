import request from "supertest";
import app from "../../src/infrastructure/server";
import { PoolRepository } from "../../src/adapters/outbound/postgres/PoolRepository";
import { Pool } from "../../src/core/domain/Pool";

jest.mock("@adapters/outbound/postgres/PoolRepository");

const MockPoolRepo = PoolRepository as jest.MockedClass<typeof PoolRepository>;

describe("/pools API Integration", () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();
    MockPoolRepo.prototype.create = mockCreate;
  });

  afterEach(() => jest.clearAllMocks());

  it("POST /pools → successfully creates a valid pool", async () => {
    const pool = new Pool(2025, [
      { shipId: "S1", cbBefore: 100, cbAfter: 0 },
      { shipId: "S2", cbBefore: -50, cbAfter: 0 },
      { shipId: "S3", cbBefore: -50, cbAfter: 0 },
    ]);

    mockCreate.mockResolvedValue(pool);

    const res = await request(app)
      .post("/pools")
      .send({
        year: 2025,
        members: [
          { shipId: "S1", cbBefore: 100 },
          { shipId: "S2", cbBefore: -50 },
          { shipId: "S3", cbBefore: -50 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.year).toBe(2025);
    expect(res.body.message).toContain("created successfully");
    expect(mockCreate).toHaveBeenCalled();
  });

  it("POST /pools → returns 400 for missing members", async () => {
    const res = await request(app).post("/pools").send({ year: 2025 });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("members");
  });

  it("POST /pools → returns 400 for invalid member data types", async () => {
    const res = await request(app)
      .post("/pools")
      .send({
        year: 2025,
        members: [{ shipId: 123, cbBefore: "invalid" }],
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Each pool member must include");
  });

  it("POST /pools → handles domain-level invalid pool (negative total CB)", async () => {
    // Simulate a domain error thrown by Pool entity
    mockCreate.mockRejectedValue(new Error("Invalid pool: total CB < 0"));

    const res = await request(app)
      .post("/pools")
      .send({
        year: 2025,
        members: [
          { shipId: "S1", cbBefore: -100 },
          { shipId: "S2", cbBefore: -50 },
        ],
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain("Invalid pool");
  });
});
