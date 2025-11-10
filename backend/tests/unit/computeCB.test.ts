import { computeCB } from "../../src/core/application/usecases/computeCB";
import { TARGET_INTENSITY } from "../../src/shared/constants";
import { ValidationError } from "../../src/shared/errors/DomainError";

describe("computeCB Use Case", () => {
  test("computes positive CB (Surplus)", () => {
    const result = computeCB("SHIP001", 2024, 88.0, 4800);

    expect(result.cb).toBeGreaterThan(0);
    expect(result.status).toBe("Surplus");
    expect(result.targetIntensity).toBe(TARGET_INTENSITY);
    expect(result.energyInScopeMJ).toBeCloseTo(4800 * 41000, 5);
  });

  test("computes negative CB (Deficit)", () => {
    const result = computeCB("SHIP002", 2024, 91.5, 5000);

    expect(result.cb).toBeLessThan(0);
    expect(result.status).toBe("Deficit");
  });

  test("returns Neutral when actual intensity equals target intensity", () => {
    const result = computeCB("SHIP003", 2024, TARGET_INTENSITY, 5000);

    expect(result.status).toBe("Neutral");
    expect(result.cb).toBeCloseTo(0, 6);
  });

  test("throws on invalid fuel consumption", () => {
    expect(() => computeCB("S1", 2024, 88, -1))
      .toThrow(ValidationError);
    expect(() => computeCB("S1", 2024, 88, -1))
      .toThrow("Fuel consumption must be positive.");
  });

  test("throws on invalid ghgIntensity", () => {
    expect(() => computeCB("S1", 2024, 0, 1000))
      .toThrow("Invalid GHG intensity.");
  });
});
