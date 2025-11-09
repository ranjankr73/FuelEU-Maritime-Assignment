import { Route } from "../../domain/Route";

const TARGET_INTENSITY = 89.3368;

export interface ComparisonResult {
    route_id: string
    ghg_intensity: number
    percent_diff: number
    compliant: boolean
}

export function computeComparison(baseline: Route, others: Route[]): { baseline: Route, comparisons: ComparisonResult[], target: number} {
    if(!baseline) throw new Error("Baseline route not found");

    const comparisons = others
        .filter((r) => r.id != baseline.id)
        .map((r) => {
            const percent_diff = ((r.ghg_intensity / baseline.ghg_intensity) - 1) * 100;

            const compliant = r.ghg_intensity <= TARGET_INTENSITY;

            return {
                route_id: r.route_id,
                ghg_intensity: r.ghg_intensity,
                percent_diff: Number(percent_diff.toFixed(3)),
                compliant,
            };
        });

        return { baseline, comparisons, target: TARGET_INTENSITY };
}