import { computeComparison } from "../../core/application/usecases/computeComparison";
import { Route } from "../../core/domain/Route";

describe("computeComparison", () => {
    const baseline: Route = {
        id: 1,
        route_id: "R001",
        vessel_type: "Container",
        fuel_type: "HFO",
        year: 2024,
        ghg_intensity: 91.0,
        fuel_consumption: 5000,
        distance: 12000,
        total_emissions: 4500,
        is_baseline: true,
    };

    const others: Route[] = [
        { ...baseline, id: 2, route_id: "R002", ghg_intensity: 88.0, is_baseline: false },
        { ...baseline, id: 3, route_id: "R003", ghg_intensity: 93.5, is_baseline: false }
    ];

    test("computes percent difference and compliance", () => {
        const result = computeComparison(baseline, others);

        expect(result.baseline.route_id).toBe("R001");
        expect(result.comparisons.length).toBe(2);
        expect(result.comparisons[0]).toHaveProperty("percent_diff");
        expect(typeof result.comparisons[0]?.compliant).toBe("boolean");
    });
});