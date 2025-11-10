import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import path from "path";

const prisma = new PrismaClient();

describe("🧪 Data Seeding Tests", () => {
  const seedScriptPath = path.resolve(__dirname, "../../src/infrastructure/db/seed.ts");

  beforeAll(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE routes RESTART IDENTITY CASCADE;`);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("runs the seed script successfully", async () => {
    const output = execSync(`npx ts-node ${seedScriptPath}`).toString();
    expect(output).toContain("✅ Seed data inserted successfully.");
  });

  it("inserts expected number of route records", async () => {
    const count = await prisma.routes.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  it("ensures baseline route exists", async () => {
    const baseline = await prisma.routes.findFirst({
      where: { is_baseline: true },
    });
    expect(baseline).not.toBeNull();
    expect(baseline?.route_id).toBe("R001");
  });

  it("should be idempotent when re-run (no duplicates)", async () => {
    execSync(`npx ts-node ${seedScriptPath}`);
    const allRoutes = await prisma.routes.findMany();

    const uniqueIds = new Set(allRoutes.map((r) => r.route_id));
    expect(uniqueIds.size).toBe(5);
  });
});
