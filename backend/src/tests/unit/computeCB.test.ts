import { computeCB } from "../../core/application/usecases/computeCB";

describe("computeCB", () => {
    test("returns negative CB when intensity above target", () => {
        const cb = computeCB(91.0, 5000);
        expect(Number(cb)).toBeLessThan(0);
    });

    test("returns positive CB when intensity below target", () => {
        const cb = computeCB(89.0, 4800);
        expect(Number(cb)).toBeGreaterThan(0);
    });

    test("returns near zero CB when intensity equal to target", () => {
        const cb = computeCB(89.3368, 5000);
        expect(Number(cb)).toBeCloseTo(0);
    });
});