import { computeComparison } from "../../src/core/application/usecases/computeComparison";
import { Route } from "../../src/core/domain/Route";
import { TARGET_INTENSITY } from "../../src/shared/constants";
import { EntityNotFoundError } from "../../src/shared/errors/DomainError";

describe("computeComparison", () => {
  const baseline = new Route(
    1,
    "R001",
    "Container",
    "HFO",
    2024,
    91.0,
    5000,
    12000,
    4500,
    true
  );

  const other = new Route(
    2,
    "R002",
    "BulkCarrier",
    "LNG",
    2024,
    88.0,
    4800,
    11500,
    4200
  );

  const another = new Route(
    3,
    "R003",
    "Tanker",
    "HFO",
    2024,
    92.5,
    4900,
    11800,
    4400
  );

  test("computes correct percent difference and compliance", () => {
    const { baseline: b, comparisons, target } = computeComparison(baseline, [baseline, other]);

    expect(b.routeId).toBe("R001");
    expect(target).toBe(TARGET_INTENSITY);
    expect(comparisons).toHaveLength(1);

    const c = comparisons[0];
    expect(c.routeId).toBe("R002");
    expect(c.ghgIntensity).toBe(88.0);
    // (88 / 91 - 1) * 100 = -3.297%
    expect(c.percentDiff).toBeCloseTo(-3.297, 3);
    expect(c.compliant).toBe(true);
    expect(c.improved).toBe(true);
  });

  test("handles multiple comparison routes correctly", () => {
    const { comparisons } = computeComparison(baseline, [baseline, other, another]);

    expect(comparisons).toHaveLength(2);
    const [first, second] = comparisons;

    expect(first.routeId).toBe("R002");
    expect(second.routeId).toBe("R003");
    expect(first.percentDiff).toBeLessThan(0); // improved
    expect(second.percentDiff).toBeGreaterThan(0); // worse
  });

  test("throws EntityNotFoundError when baseline is missing", () => {
    expect(() => computeComparison(undefined as any, [other]))
      .toThrow(EntityNotFoundError);
  });

  test("throws EntityNotFoundError when comparison routes list is empty", () => {
    expect(() => computeComparison(baseline, []))
      .toThrow(EntityNotFoundError);
  });
});
